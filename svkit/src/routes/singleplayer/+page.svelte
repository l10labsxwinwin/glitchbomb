<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { dojoConfig } from '$lib/dojoConfig';
	import { setup } from '$lib/dojo/setup';
	import { setupWorld } from '$lib/typescript/contracts.gen';
	import { client } from '$lib/apollo';
	import { SvelteMap } from 'svelte/reactivity';
	import { getPlayerKey } from '$lib/keys';
	import PlayerBar from '$lib/components/PlayerBar.svelte';
	import GamepackCard from '$lib/components/GamepackCard.svelte';
	import type { BurnerManager } from '@dojoengine/create-burner';
	import type { Account } from 'starknet';
	import type { DojoProvider } from '@dojoengine/core';
	import { GET_PLAYERS, GET_GAMEPACKS, ENTITY_UPDATED } from './queries';
	import {
		updateBurnerList as updateBurnerListHelper,
		createBurner as createBurnerHelper,
		clearBurners as clearBurnersHelper,
		saveBurners as saveBurnersHelper,
		restoreBurners as restoreBurnersHelper
	} from './burner_helpers';

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
	let burnerManager: BurnerManager | undefined = $state();
	let account: Account | undefined = $state();
	let dojoProvider: DojoProvider | undefined = $state();
	let burnerAddress = $state('');
	let burnerCount = $state(0);
	let burners: any[] = $state([]);
	let claiming = $state(false);
	let buyingGamepack = $state(false);
	let playerMap = new SvelteMap<string, Player>();
	let players = $derived(Array.from(playerMap.values()));
	let currentPlayer = $derived(playerMap.get(getPlayerKey(burnerAddress)) || null);
	let gamepackMap = new SvelteMap<number, GamePack>();
	let gamepacks = $derived(Array.from(gamepackMap.values()));
	let subscription: any = null;

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
		const result = updateBurnerListHelper(burnerManager);
		burners = result.burners;
		burnerCount = result.count;
	}

	async function createBurner() {
		await createBurnerHelper(burnerManager);
		updateBurnerList();
	}

	function clearBurners() {
		clearBurnersHelper(burnerManager);
		updateBurnerList();
	}

	async function saveBurners() {
		await saveBurnersHelper(burnerManager);
	}

	async function restoreBurners() {
		await restoreBurnersHelper(burnerManager);
		updateBurnerList();
	}

	async function selectBurner(event: Event) {
		if (!burnerManager) return;
		const target = event.target as HTMLSelectElement;
		burnerManager.select(target.value);
		account = burnerManager.getActiveAccount();
		if (account) {
			burnerAddress = account.address;
			await loadGamepacks(account.address);
		}
		console.log('Switched to burner:', target.value);
	}

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
			alert('Free USDC claimed successfully!');
		} catch (err) {
			console.error('Failed to claim free USDC:', err);
			alert('Failed to claim free USDC. See console for details.');
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
			alert('Gamepack bought successfully!');
		} catch (err) {
			console.error('Failed to buy gamepack:', err);
			alert('Failed to buy gamepack. See console for details.');
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

					<div>
						<h2 class="text-2xl font-bold mb-4">Gamepacks ({gamepacks.length})</h2>
						{#if gamepacks.length > 0}
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{#each gamepacks as gamepack}
									<GamepackCard {gamepack} />
								{/each}
							</div>
						{:else}
							<p class="text-sm opacity-60">No gamepacks found. Buy one to get started!</p>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
