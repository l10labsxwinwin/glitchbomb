<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gql } from '@apollo/client/core';
	import { client } from '$lib/apollo';
	import { account } from '$lib/stores/controller';
	import { DojoProvider } from '@dojoengine/core';
	import { setupWorld } from '$lib/typescript/contracts.gen';
	import { dojoConfig } from '$lib/dojoConfig';

	interface GamePackData {
		current_game_id: number;
		accumulated_moonrocks: number;
	}

	interface GamePack {
		gamepack_id: number;
		state: string;
		data: GamePackData;
		entity: {
			keys: string[];
		};
	}

	const GET_GAMEPACKS = gql`
		query GetGamePacks {
			glitchbombGamePackModels {
				edges {
					node {
						gamepack_id
						state
						data {
							current_game_id
							accumulated_moonrocks
						}
						entity {
							keys
						}
					}
				}
			}
		}
	`;

	const ENTITY_UPDATED = gql`
		subscription EntityUpdated {
			entityUpdated {
				id
				keys
				models {
					__typename
					... on GLITCHBOMB_GamePack {
						gamepack_id
						state
						data {
							current_game_id
							accumulated_moonrocks
						}
					}
				}
			}
		}
	`;

	let gamepacks = $state<GamePack[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let subscription: any = null;

	const RPC_URL = 'https://api.cartridge.gg/x/starknet/sepolia';
	const provider = new DojoProvider(dojoConfig.manifest, RPC_URL);
	const contracts = setupWorld(provider);

	async function filterOwnedGamepacks(allGamepacks: GamePack[]): Promise<GamePack[]> {
		if (!$account || allGamepacks.length === 0) return [];

		try {
			const owned: GamePack[] = [];
			
			for (const gamepack of allGamepacks) {
				if (!gamepack.gamepack_id) continue;
				try {
					const owner = await contracts.Collection.ownerOf(gamepack.gamepack_id);
					
					let ownerAddress: string;
					if (typeof owner === 'bigint') {
						ownerAddress = '0x' + owner.toString(16);
					} else if (typeof owner === 'object' && 'toString' in owner) {
						ownerAddress = owner.toString();
					} else {
						ownerAddress = String(owner);
					}
					
					if (ownerAddress.toLowerCase() === $account.address.toLowerCase()) {
						owned.push(gamepack);
					}
				} catch (e) {
				}
			}

			return owned;
		} catch (e) {
			return [];
		}
	}

	async function loadGamepacks() {
		try {
			if (!$account) {
				loading = false;
				return;
			}
			
			const result = await client.query({
				query: GET_GAMEPACKS,
				fetchPolicy: 'network-only'
			});

			const allGamepacks = result.data.glitchbombGamePackModels?.edges?.map((edge: any) => edge.node) || [];
			gamepacks = await filterOwnedGamepacks(allGamepacks);
			loading = false;

			if (!subscription) {
				subscription = client.subscribe({
					query: ENTITY_UPDATED
				}).subscribe({
					next: async (data) => {
						if (data.data?.entityUpdated?.models) {
							const models = data.data.entityUpdated.models;
							for (const model of models) {
								if (model.__typename === 'GLITCHBOMB_GamePack') {
									if (!$account || !model.gamepack_id) continue;
									
									try {
										const owner = await contracts.Collection.ownerOf(model.gamepack_id);
										
										let ownerAddress: string;
										if (typeof owner === 'bigint') {
											ownerAddress = '0x' + owner.toString(16);
										} else if (typeof owner === 'object' && 'toString' in owner) {
											ownerAddress = owner.toString();
										} else {
											ownerAddress = String(owner);
										}
										
										if (ownerAddress.toLowerCase() === $account.address.toLowerCase()) {
											const index = gamepacks.findIndex(gp => gp.gamepack_id === model.gamepack_id);
											if (index >= 0) {
												gamepacks[index] = model;
											} else {
												gamepacks.push(model);
											}
										}
									} catch (e) {
									}
								}
							}
						}
				},
				error: (err) => {
				}
				});
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch data';
			loading = false;
		}
	}

	onMount(() => {
		loadGamepacks();
	});

	$effect(() => {
		if ($account) {
			loadGamepacks();
		}
	});

	onDestroy(() => {
		if (subscription) {
			subscription.unsubscribe();
		}
	});
</script>

<div class="min-h-screen p-8 bg-black text-white">
	<div class="mb-8">
		<a href="/" class="text-sm opacity-60 hover:opacity-100">← BACK</a>
	</div>

	<h1 class="text-4xl font-bold mb-8">MY GAMEPACKS</h1>

	{#if !$account}
		<div class="flex flex-col gap-4">
			<p class="opacity-60">Please connect your wallet to view your gamepacks</p>
			<a href="/" class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-center w-fit">
				Go Back and Connect
			</a>
		</div>
	{:else if loading}
		<p>Loading your gamepacks...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else if gamepacks.length === 0}
		<div class="flex flex-col gap-4">
			<p class="opacity-60">No gamepacks found. Buy a gamepack to get started!</p>
			<a href="/" class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-center w-fit">
				Go Back to Buy
			</a>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each gamepacks as gamepack}
				<a href="/gamepacks/{gamepack.gamepack_id}" class="border border-white p-4 hover:bg-white hover:text-black transition-colors cursor-pointer">
					<div class="grid grid-cols-2 gap-2 text-sm">
						<div><span class="opacity-60">Gamepack ID:</span> <span class="font-bold">{gamepack.gamepack_id}</span></div>
						<div><span class="opacity-60">State:</span> <span class="font-bold">{gamepack.state}</span></div>
						<div><span class="opacity-60">Current Game ID:</span> {gamepack.data.current_game_id}</div>
						<div><span class="opacity-60">Accumulated Moonrocks:</span> {gamepack.data.accumulated_moonrocks}</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
