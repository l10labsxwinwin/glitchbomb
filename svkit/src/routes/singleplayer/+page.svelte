<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { setupWorld } from '$lib/typescript/contracts.gen';
	import { client } from '$lib/apollo';
	import { SvelteMap } from 'svelte/reactivity';
	import { getPlayerKey } from '$lib/keys';
	import PlayerBar from '$lib/components/PlayerBar.svelte';
	import GamepackTable from '$lib/components/GamepackTable.svelte';
	import BurnerWalletBar from '$lib/components/BurnerWalletBar.svelte';
	import type { BurnerManager } from '@dojoengine/create-burner';
	import type { Account } from 'starknet';
	import type { DojoProvider } from '@dojoengine/core';
	import { GET_PLAYERS, GET_GAMEPACKS, ENTITY_UPDATED } from './queries';
	import {
		burnerManager as burnerManagerStore,
		account as accountStore,
		dojoProvider as dojoProviderStore
	} from '$lib/stores/burner';
	import { toasts } from '$lib/stores/toast';

	interface PlayerData {
		usdc: number;
		gamepacks_bought: number;
	}

	interface Player {
		player_id: string;
		state: string;
		data: PlayerData;
	}

	interface GamePackData {
		current_game_id: number;
		accumulated_moonrocks: number;
	}

	interface GamePack {
		player_id: string;
		gamepack_id: number;
		state: string;
		data: GamePackData;
	}

	let loading = $state(true);
	let error = $state('');
	let burnerAddress = $state('');
	let claiming = $state(false);
	let buyingGamepack = $state(false);
	let playerMap = new SvelteMap<string, Player>();
	let players = $derived(Array.from(playerMap.values()));
	let currentPlayer = $derived(playerMap.get(getPlayerKey(burnerAddress)) || null);
	let gamepackMap = new SvelteMap<number, GamePack>();
	let gamepacks = $derived(Array.from(gamepackMap.values()));
	let subscription: any = null;
	let previousGamepackCount = $state(0);

	let account = $state<Account | undefined>(undefined);
	let dojoProvider = $state<DojoProvider | undefined>(undefined);

	$effect(() => {
		account = $accountStore;
		dojoProvider = $dojoProviderStore;
		if (account) {
			const newAddress = account.address;
			if (newAddress !== burnerAddress) {
				burnerAddress = newAddress;
				if (subscription) {
					subscription.unsubscribe();
					subscription = null;
				}
				gamepackMap.clear();
				loadData();
			} else if (!subscription) {
				loadData();
			}
		}
	});

	async function loadData() {
		try {
			if (!burnerAddress) return;

			const queryResult = await client.query({
				query: GET_PLAYERS,
				fetchPolicy: 'network-only'
			});

			const nodes =
				queryResult.data.glitchbombPlayerModels?.edges?.map((edge: any) => edge.node) || [];
			nodes.forEach((player: Player) => {
				playerMap.set(getPlayerKey(player.player_id), player);
			});

			const gamepackResult = await client.query({
				query: GET_GAMEPACKS,
				variables: { playerId: burnerAddress },
				fetchPolicy: 'network-only'
			});

			const gamepackNodes =
				gamepackResult.data.glitchbombGamePackModels?.edges?.map((edge: any) => edge.node) || [];
			gamepackNodes.forEach((gamepack: GamePack) => {
				gamepackMap.set(gamepack.gamepack_id, gamepack);
			});

			previousGamepackCount = gamepackNodes.length;

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
									const currentPlayerData = playerMap.get(key);
									playerMap.set(key, model);
									
									if (model.player_id === burnerAddress && currentPlayerData) {
										if (model.data.gamepacks_bought > currentPlayerData.data.gamepacks_bought) {
											console.log('New gamepack detected, reloading gamepacks...');
											loadGamepacks(burnerAddress);
										}
									}
								}
							});
						}
					},
					error: (err) => {
						console.error('Subscription error:', err);
					}
				});

			loading = false;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load data';
			console.error('Failed to load data:', e);
			loading = false;
		}
	}

	onMount(() => {
		if (account) {
			loadData();
		}
	});

	onDestroy(() => {
		if (subscription) {
			subscription.unsubscribe();
		}
	});

	async function loadGamepacks(playerId: string) {
		try {
			gamepackMap.clear();
			const gamepackResult = await client.query({
				query: GET_GAMEPACKS,
				variables: { playerId },
				fetchPolicy: 'network-only'
			});

			const gamepackNodes =
				gamepackResult.data.glitchbombGamePackModels?.edges?.map((edge: any) => edge.node) || [];
			gamepackNodes.forEach((gamepack: GamePack) => {
				gamepackMap.set(gamepack.gamepack_id, gamepack);
			});
		} catch (err) {
			console.error('Failed to load gamepacks:', err);
		}
	}

	async function claimFreeUsdc() {
		if (!account || !dojoProvider) return;

		claiming = true;
		try {
			console.log('Claiming free USDC...');
			const world = setupWorld(dojoProvider);
			const result = await world.gb_contract_v2.claimFreeUsdc(account);
			console.log('✅ Free USDC claimed!', result);
			toasts.add('Free USDC claimed successfully!', 'success');
		} catch (err) {
			console.error('Failed to claim free USDC:', err);
			toasts.add('Failed to claim free USDC', 'error');
		} finally {
			claiming = false;
		}
	}

	async function buyGamepack() {
		if (!account || !dojoProvider) return;

		buyingGamepack = true;
		try {
			console.log('Buying gamepack...');
			const world = setupWorld(dojoProvider);
			const result = await world.gb_contract_v2.buyGamepack(account);
			console.log('✅ Gamepack bought!', result);
			toasts.add('Gamepack bought successfully!', 'success');
		} catch (err) {
			console.error('Failed to buy gamepack:', err);
			toasts.add('Failed to buy gamepack', 'error');
		} finally {
			buyingGamepack = false;
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

			<BurnerWalletBar />
		</div>
	</div>

	<PlayerBar player={currentPlayer} />

	<div class="flex-1 p-8">
		<div class="max-w-7xl mx-auto">
			{#if !loading && !error}
				<div class="space-y-6">
					<div class="flex gap-3">
						<button
							onclick={claimFreeUsdc}
							disabled={claiming}
							class="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold"
						>
							{claiming ? 'Claiming...' : 'Claim Free USDC'}
						</button>
						<button
							onclick={buyGamepack}
							disabled={buyingGamepack}
							class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold"
						>
							{buyingGamepack ? 'Buying...' : 'Buy Gamepack'}
						</button>
					</div>

					<GamepackTable {gamepacks} />
				</div>
			{/if}
		</div>
	</div>
</div>
