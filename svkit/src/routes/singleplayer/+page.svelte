<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { dojoConfig } from '$lib/dojoConfig';
	import { setup } from '$lib/dojo/setup';
	import { setupWorld } from '$lib/typescript/contracts.gen';
	import { client } from '$lib/apollo';
	import { gql } from '@apollo/client/core';
	import { SvelteMap } from 'svelte/reactivity';
	import { getPlayerKey } from '$lib/keys';
	import type { BurnerManager } from '@dojoengine/create-burner';
	import type { Account } from 'starknet';
	import type { DojoProvider } from '@dojoengine/core';

	interface PlayerData {
		usdc: number;
		gamepacks_bought: number;
	}

	interface Player {
		player_id: string;
		state: string;
		data: PlayerData;
	}

	let loading = $state(true);
	let error = $state('');
	let burnerManager: BurnerManager | undefined = $state();
	let account: Account | undefined = $state();
	let dojoProvider: DojoProvider | undefined = $state();
	let burnerAddress = $state('');
	let burnerCount = $state(0);
	let burners: any[] = $state([]);
	let claiming = $state(false);
	let playerMap = $state(new SvelteMap<string, Player>());
	let players = $derived(Array.from(playerMap.values()));
	let currentPlayer = $derived(playerMap.get(getPlayerKey(burnerAddress)) || null);
	let subscription: any = null;

	const GET_PLAYERS = gql`
		query GetPlayers {
			glitchbombPlayerModels {
				edges {
					node {
						player_id
						state
						data {
							usdc
							gamepacks_bought
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
					... on glitchbomb_Player {
						player_id
						state
						data {
							usdc
							gamepacks_bought
						}
					}
				}
			}
		}
	`;

	onMount(async () => {
		try {
			console.log('Initializing Dojo app...');
			const result = await setup(dojoConfig);
			burnerManager = result.burnerManager;
			account = result.account;
			dojoProvider = result.dojoProvider;
			burnerAddress = account.address;
			updateBurnerList();
			loading = false;
			console.log('✅ Burner wallet initialized');
			console.log('Active burner address:', account.address);

			const queryResult = await client.query({
				query: GET_PLAYERS,
				fetchPolicy: 'network-only'
			});

			const nodes =
				queryResult.data.glitchbombPlayerModels?.edges?.map((edge: any) => edge.node) || [];
			nodes.forEach((player: Player) => {
				playerMap.set(getPlayerKey(player.player_id), player);
			});

			subscription = client
				.subscribe({
					query: ENTITY_UPDATED
				})
				.subscribe({
					next: (data) => {
						if (data.data?.entityUpdated?.models) {
							const models = data.data.entityUpdated.models;
							models.forEach((model: any) => {
								if (model.__typename === 'glitchbomb_Player') {
									const key = getPlayerKey(model.player_id);
									playerMap.set(key, model);
								}
							});
						}
					},
					error: (err) => {
						console.error('Subscription error:', err);
					}
				});
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to initialize burner wallet';
			console.error('Failed to initialize:', e);
			loading = false;
		}
	});

	onDestroy(() => {
		if (subscription) {
			subscription.unsubscribe();
		}
	});

	function updateBurnerList() {
		if (!burnerManager) return;
		burners = burnerManager.list();
		burnerCount = burners.length;
	}

	async function createBurner() {
		if (!burnerManager) return;
		console.log('Creating new burner...');
		await burnerManager.create();
		updateBurnerList();
		console.log('✅ New burner created');
	}

	function clearBurners() {
		if (!burnerManager) return;
		if (confirm('Are you sure you want to clear all burners?')) {
			burnerManager.clear();
			updateBurnerList();
			console.log('✅ All burners cleared');
		}
	}

	async function saveBurners() {
		if (!burnerManager) return;
		try {
			await burnerManager.copyBurnersToClipboard();
			alert('Burners saved to clipboard!');
		} catch (err) {
			console.error('Failed to save burners:', err);
		}
	}

	async function restoreBurners() {
		if (!burnerManager) return;
		try {
			await burnerManager.setBurnersFromClipboard();
			updateBurnerList();
			alert('Burners restored from clipboard!');
		} catch (err) {
			console.error('Failed to restore burners:', err);
		}
	}

	function selectBurner(event: Event) {
		if (!burnerManager) return;
		const target = event.target as HTMLSelectElement;
		burnerManager.select(target.value);
		account = burnerManager.getActiveAccount();
		if (account) {
			burnerAddress = account.address;
		}
		console.log('Switched to burner:', target.value);
	}

	async function claimFreeUsdc() {
		if (!account || !dojoProvider) return;

		claiming = true;
		try {
			console.log('Claiming free USDC...');
			const world = setupWorld(dojoProvider);
			const result = await world.gb_contract_v2.claimFreeUsdc(account);
			console.log('✅ Free USDC claimed!', result);
			alert('Free USDC claimed successfully!');
		} catch (err) {
			console.error('Failed to claim free USDC:', err);
			alert('Failed to claim free USDC. See console for details.');
		} finally {
			claiming = false;
		}
	}
</script>

<div class="min-h-screen flex flex-col">
	<div class="bg-black/50 border-b border-white/10 px-4 py-3">
		<div class="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
			<div class="flex items-center gap-4">
				<a href="/" class="text-sm opacity-60 hover:opacity-100">← BACK</a>
				<span class="text-sm font-bold">SINGLE PLAYER</span>
			</div>

			{#if loading}
				<div class="text-sm opacity-60">Loading wallet...</div>
			{:else if error}
				<div class="text-sm text-red-500">{error}</div>
			{:else}
				<div class="flex items-center gap-3 flex-wrap">
					<select
						id="burner-select"
						onchange={selectBurner}
						class="px-3 py-1.5 text-sm bg-black/50 border border-white/20 rounded"
					>
						{#each burners as burner}
							<option value={burner.address} selected={burner.active}>
								{burner.address.slice(0, 6)}...{burner.address.slice(-4)}
							</option>
						{/each}
					</select>

					<div class="flex gap-2">
						<button
							onclick={createBurner}
							class="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded"
							title="Create New Burner"
						>
							+ New
						</button>
						<button
							onclick={saveBurners}
							class="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 rounded"
							title="Save to Clipboard"
						>
							Save
						</button>
						<button
							onclick={restoreBurners}
							class="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 rounded"
							title="Restore from Clipboard"
						>
							Restore
						</button>
						<button
							onclick={clearBurners}
							class="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 rounded"
							title="Clear All Burners"
						>
							Clear
						</button>
					</div>

					<div class="text-xs opacity-60">{burnerCount} burner{burnerCount !== 1 ? 's' : ''}</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex-1 p-8">
		<div class="max-w-7xl mx-auto">
			<h1 class="text-4xl font-bold mb-8">Game Content Here</h1>

			{#if !loading && !error}
				<div class="space-y-6">
					<button
						onclick={claimFreeUsdc}
						disabled={claiming}
						class="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold"
					>
						{claiming ? 'Claiming...' : 'Claim Free USDC'}
					</button>

					<div class="bg-black/30 p-6 rounded-lg">
						<h2 class="text-2xl font-bold mb-4">Player Data</h2>
						{#if currentPlayer}
							<div class="bg-black/50 p-4 rounded">
								<div class="space-y-2">
									<div class="flex gap-2">
										<span class="font-semibold">Player ID:</span>
										<code class="bg-black/50 px-2 py-1 rounded text-sm"
											>{currentPlayer.player_id}</code
										>
									</div>
									<div class="flex gap-2">
										<span class="font-semibold">State:</span>
										<span class="bg-black/50 px-2 py-1 rounded text-sm"
											>{currentPlayer.state}</span
										>
									</div>
									<div class="flex gap-2">
										<span class="font-semibold">USDC:</span>
										<span class="bg-black/50 px-2 py-1 rounded text-sm"
											>{currentPlayer.data.usdc.toString()}</span
										>
									</div>
									<div class="flex gap-2">
										<span class="font-semibold">Gamepacks Bought:</span>
										<span class="bg-black/50 px-2 py-1 rounded text-sm"
											>{currentPlayer.data.gamepacks_bought.toString()}</span
										>
									</div>
								</div>
							</div>
						{:else}
							<p class="text-sm opacity-60">
								No player data for this wallet. Try claiming free USDC first.
							</p>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
