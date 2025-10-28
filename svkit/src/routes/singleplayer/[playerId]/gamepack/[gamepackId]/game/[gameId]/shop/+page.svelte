<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { gql } from '@apollo/client/core';
	import { client } from '$lib/apollo';
	import { account, dojoProvider } from '$lib/stores/burner';
	import { setupWorld } from '$lib/typescript/contracts.gen';
	import { toasts } from '$lib/stores/toast';
	import ShopItemsView from '$lib/components/ShopItemsView.svelte';
	import InShopActions from '$lib/components/InShopActions.svelte';

	const playerId = $derived($page.params.playerId);
	const gamepackId = $derived($page.params.gamepackId);
	const gameId = $derived($page.params.gameId);

	let currentAccount = $state<typeof $account>(undefined);
	let accountReady = $state(false);

	$effect(() => {
		currentAccount = $account;
		if (currentAccount) {
			accountReady = true;
			if (currentAccount.address !== playerId) {
				goto('/singleplayer');
			}
		}
	});

	$effect(() => {
		if (game && game.state === 'Level') {
			goto(`/singleplayer/${playerId}/gamepack/${gamepackId}/game/${gameId}`);
		}
	});

	const GET_GAME = gql`
		query GetGame($playerId: String!, $gamepackId: Int!, $gameId: Int!) {
			glitchbombGameModels(where: { player_id: $playerId, gamepack_id: $gamepackId, game_id: $gameId }) {
				edges {
					node {
						player_id
						gamepack_id
						game_id
						state
						data {
							glitch_chips
						}
					}
				}
			}
		}
	`;

	const GET_ORBS = gql`
		query GetOrbs($playerId: String!, $gamepackId: Int!, $gameId: Int!) {
			glitchbombOrbsInGameModels(where: { player_id: $playerId, gamepack_id: $gamepackId, game_id: $gameId }) {
				edges {
					node {
						player_id
						gamepack_id
						game_id
						non_buyable {
							count
							base_price
							current_price
							effect {
								Point
								PointPerOrbRemaining
								PointPerBombPulled
								GlitchChips
								Moonrocks
								Health
								Bomb
								Multiplier
								BombImmunity
								option
							}
						}
						common {
							count
							base_price
							current_price
							effect {
								Point
								PointPerOrbRemaining
								PointPerBombPulled
								GlitchChips
								Moonrocks
								Health
								Bomb
								Multiplier
								BombImmunity
								option
							}
						}
						rare {
							count
							base_price
							current_price
							effect {
								Point
								PointPerOrbRemaining
								PointPerBombPulled
								GlitchChips
								Moonrocks
								Health
								Bomb
								Multiplier
								BombImmunity
								option
							}
						}
						cosmic {
							count
							base_price
							current_price
							effect {
								Point
								PointPerOrbRemaining
								PointPerBombPulled
								GlitchChips
								Moonrocks
								Health
								Bomb
								Multiplier
								BombImmunity
								option
							}
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
					... on glitchbomb_Game {
						player_id
						gamepack_id
						game_id
						state
						data {
							glitch_chips
						}
					}
					... on glitchbomb_OrbsInGame {
						player_id
						gamepack_id
						game_id
						non_buyable {
							count
							base_price
							current_price
							effect {
								Point
								PointPerOrbRemaining
								PointPerBombPulled
								GlitchChips
								Moonrocks
								Health
								Bomb
								Multiplier
								BombImmunity
								option
							}
						}
						common {
							count
							base_price
							current_price
							effect {
								Point
								PointPerOrbRemaining
								PointPerBombPulled
								GlitchChips
								Moonrocks
								Health
								Bomb
								Multiplier
								BombImmunity
								option
							}
						}
						rare {
							count
							base_price
							current_price
							effect {
								Point
								PointPerOrbRemaining
								PointPerBombPulled
								GlitchChips
								Moonrocks
								Health
								Bomb
								Multiplier
								BombImmunity
								option
							}
						}
						cosmic {
							count
							base_price
							current_price
							effect {
								Point
								PointPerOrbRemaining
								PointPerBombPulled
								GlitchChips
								Moonrocks
								Health
								Bomb
								Multiplier
								BombImmunity
								option
							}
						}
					}
				}
			}
		}
	`;

	let game = $state<any | null>(null);
	let orbs = $state<any | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let subscription: any = null;
	let nextingLevel = $state(false);
	let buyingOrbs = $state(new Map<string, boolean>());

	async function loadOrbsData() {
		if (!gameId || !gamepackId || !accountReady) return;

		try {
			const gamepackIdInt = parseInt(gamepackId);
			const gameIdInt = parseInt(gameId);

			const [gameResult, orbsResult] = await Promise.all([
				client.query({
					query: GET_GAME,
					variables: { playerId, gamepackId: gamepackIdInt, gameId: gameIdInt },
					fetchPolicy: 'network-only'
				}),
				client.query({
					query: GET_ORBS,
					variables: { playerId, gamepackId: gamepackIdInt, gameId: gameIdInt },
					fetchPolicy: 'network-only'
				})
			]);

			const gameNodes =
				gameResult.data.glitchbombGameModels?.edges?.map((edge: any) => edge.node) || [];
			if (gameNodes.length > 0) {
				game = gameNodes[0];
			}

			const orbNodes =
				orbsResult.data.glitchbombOrbsInGameModels?.edges?.map((edge: any) => edge.node) || [];
			if (orbNodes.length > 0) {
				orbs = orbNodes[0];
			}

			loading = false;

			subscription = client
				.subscribe({
					query: ENTITY_UPDATED
				})
				.subscribe({
					next: (data) => {
						if (data.data?.entityUpdated?.models) {
							const models = data.data.entityUpdated.models;
							models.forEach((model: any) => {
								if (
									model.__typename === 'glitchbomb_Game' &&
									model.player_id === playerId &&
									model.gamepack_id === gamepackIdInt &&
									model.game_id === gameIdInt
								) {
									game = model;
								} else if (
									model.__typename === 'glitchbomb_OrbsInGame' &&
									model.player_id === playerId &&
									model.gamepack_id === gamepackIdInt &&
									model.game_id === gameIdInt
								) {
									orbs = model;
								}
							});
						}
					},
					error: (err) => {
						console.error('Subscription error:', err);
					}
				});
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch data';
			loading = false;
		}
	}

	$effect(() => {
		if (accountReady && !subscription) {
			loadOrbsData();
		}
	});

	onMount(() => {
		if (accountReady) {
			loadOrbsData();
		}
	});

	onDestroy(() => {
		if (subscription) {
			subscription.unsubscribe();
		}
	});

	async function buyCommon(index: number) {
		if (!$account || !$dojoProvider || !gamepackId) return;

		const key = `common-${index}`;
		buyingOrbs.set(key, true);
		try {
			console.log(`Buying common orb ${index}...`);
			const world = setupWorld($dojoProvider);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await world.gb_contract_v2.buyCommon($account, gamepackIdInt, index);
			console.log('✅ Common orb bought!', result);
			toasts.add(`Common orb ${index} bought successfully!`, 'success');
		} catch (err) {
			console.error('Failed to buy common orb:', err);
			toasts.add('Failed to buy common orb', 'error');
		} finally {
			buyingOrbs.delete(key);
		}
	}

	async function buyRare(index: number) {
		if (!$account || !$dojoProvider || !gamepackId) return;

		const key = `rare-${index}`;
		buyingOrbs.set(key, true);
		try {
			console.log(`Buying rare orb ${index}...`);
			const world = setupWorld($dojoProvider);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await world.gb_contract_v2.buyRare($account, gamepackIdInt, index);
			console.log('✅ Rare orb bought!', result);
			toasts.add(`Rare orb ${index} bought successfully!`, 'success');
		} catch (err) {
			console.error('Failed to buy rare orb:', err);
			toasts.add('Failed to buy rare orb', 'error');
		} finally {
			buyingOrbs.delete(key);
		}
	}

	async function buyCosmic(index: number) {
		if (!$account || !$dojoProvider || !gamepackId) return;

		const key = `cosmic-${index}`;
		buyingOrbs.set(key, true);
		try {
			console.log(`Buying cosmic orb ${index}...`);
			const world = setupWorld($dojoProvider);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await world.gb_contract_v2.buyCosmic($account, gamepackIdInt, index);
			console.log('✅ Cosmic orb bought!', result);
			toasts.add(`Cosmic orb ${index} bought successfully!`, 'success');
		} catch (err) {
			console.error('Failed to buy cosmic orb:', err);
			toasts.add('Failed to buy cosmic orb', 'error');
		} finally {
			buyingOrbs.delete(key);
		}
	}

	async function nextLevel() {
		if (!$account || !$dojoProvider || !gamepackId) return;

		nextingLevel = true;
		try {
			console.log('Advancing to next level...');
			const world = setupWorld($dojoProvider);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await world.gb_contract_v2.nextLevel($account, gamepackIdInt);
			console.log('✅ Advanced to next level!', result);
			toasts.add('Advanced to next level!', 'success');
		} catch (err) {
			console.error('Failed to advance level:', err);
			toasts.add('Failed to advance level', 'error');
		} finally {
			nextingLevel = false;
		}
	}
</script>

<div class="min-h-screen flex flex-col">
	<div class="bg-black/50 border-b border-white/10 px-4 py-3">
		<div class="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
			<div class="flex items-center gap-4">
				<a href="/singleplayer" class="text-sm opacity-60 hover:opacity-100">← BACK</a>
				<span class="text-sm font-bold">SHOP</span>
			</div>
		</div>
	</div>

	<div class="flex-1 p-8">
		<div class="max-w-7xl mx-auto">
			{#if loading}
				<p>Loading...</p>
			{:else if error}
				<p class="text-red-500">Error: {error}</p>
			{:else}
				<div class="space-y-6">
					{#if game}
						<div class="bg-black/30 border border-white/10 p-4 rounded-lg">
							<div class="text-center">
								<div class="text-3xl font-bold mb-1">{game.data.glitch_chips}</div>
								<div class="text-sm opacity-60">Glitch Chips</div>
							</div>
						</div>
					{/if}
					<ShopItemsView orbsInBag={orbs} onBuyCommon={buyCommon} onBuyRare={buyRare} onBuyCosmic={buyCosmic} {buyingOrbs} />
					<InShopActions onNextLevel={nextLevel} {nextingLevel} />
				</div>
			{/if}
		</div>
	</div>
</div>
