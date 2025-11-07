<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { gql } from '@apollo/client/core';
	import { client } from '$lib/apollo';
	import { account } from '$lib/stores/controller';
	import { DojoProvider, createDojoConfig } from '@dojoengine/core';
	import { setupWorld } from '$lib/typescript/contracts.gen';
	import manifest from '$lib/manifest_sepolia.json';
	import ShopItemsView from '$lib/components/ShopItemsView.svelte';
	import InShopActions from '$lib/components/InShopActions.svelte';

	const gamepackId = $derived($page.params.gamepackId);
	const gameId = $derived($page.params.gameId);

	const RPC_URL = 'https://api.cartridge.gg/x/starknet/sepolia';
	const dojoConfig = createDojoConfig({ manifest });
	const provider = new DojoProvider(dojoConfig.manifest, RPC_URL);
	const contracts = setupWorld(provider);

	$effect(() => {
		if (game && game.state === 'Level') {
			goto(`/gamepacks/${gamepackId}/game/${gameId}`);
		}
	});

	const GET_GAME = gql`
		query GetGame($gamepackId: Int!, $gameId: Int!) {
			glitchbombGameModels(where: { gamepack_id: $gamepackId, game_id: $gameId }) {
				edges {
					node {
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
		query GetOrbs($gamepackId: Int!, $gameId: Int!) {
			glitchbombOrbsInGameModels(where: { gamepack_id: $gamepackId, game_id: $gameId }) {
				edges {
					node {
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
					... on GLITCHBOMB_Game {
						gamepack_id
						game_id
						state
						data {
							glitch_chips
						}
					}
					... on GLITCHBOMB_OrbsInGame {
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
		if (!gameId || !gamepackId || !$account) return;

		try {
			const gamepackIdInt = parseInt(gamepackId);
			const gameIdInt = parseInt(gameId);

			const [gameResult, orbsResult] = await Promise.all([
				client.query({
					query: GET_GAME,
					variables: { gamepackId: gamepackIdInt, gameId: gameIdInt },
					fetchPolicy: 'network-only'
				}),
				client.query({
					query: GET_ORBS,
					variables: { gamepackId: gamepackIdInt, gameId: gameIdInt },
					fetchPolicy: 'network-only'
				})
			]);

			const gameNodes =
				(gameResult.data as any).glitchbombGameModels?.edges?.map((edge: any) => edge.node) || [];
			if (gameNodes.length > 0) {
				game = gameNodes[0];
			}

			const orbNodes =
				(orbsResult.data as any).glitchbombOrbsInGameModels?.edges?.map((edge: any) => edge.node) || [];
			if (orbNodes.length > 0) {
				orbs = orbNodes[0];
			}

			loading = false;

			if (!subscription) {
				subscription = client
					.subscribe({
						query: ENTITY_UPDATED
					})
					.subscribe({
						next: (data) => {
							if ((data.data as any)?.entityUpdated?.models) {
								const models = (data.data as any).entityUpdated.models;
								models.forEach((model: any) => {
									if (
										model.__typename === 'GLITCHBOMB_Game' &&
										model.gamepack_id === gamepackIdInt &&
										model.game_id === gameIdInt
									) {
										game = model;
									} else if (
										model.__typename === 'GLITCHBOMB_OrbsInGame' &&
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
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch data';
			loading = false;
		}
	}

	$effect(() => {
		if ($account) {
			loadOrbsData();
		}
	});

	onMount(() => {
		if ($account) {
			loadOrbsData();
		}
	});

	onDestroy(() => {
		if (subscription) {
			subscription.unsubscribe();
		}
	});

	async function buyCommon(index: number) {
		if (!$account || !gamepackId) return;

		const key = `common-${index}`;
		buyingOrbs.set(key, true);
		try {
			console.log(`Buying common orb ${index}...`);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await contracts.gb_contract_v2.buyCommon($account, gamepackIdInt, index);
			console.log('✅ Common orb bought!', result);
		} catch (err) {
			console.error('Failed to buy common orb:', err);
			alert('Failed to buy common orb');
		} finally {
			buyingOrbs.delete(key);
		}
	}

	async function buyRare(index: number) {
		if (!$account || !gamepackId) return;

		const key = `rare-${index}`;
		buyingOrbs.set(key, true);
		try {
			console.log(`Buying rare orb ${index}...`);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await contracts.gb_contract_v2.buyRare($account, gamepackIdInt, index);
			console.log('✅ Rare orb bought!', result);
		} catch (err) {
			console.error('Failed to buy rare orb:', err);
			alert('Failed to buy rare orb');
		} finally {
			buyingOrbs.delete(key);
		}
	}

	async function buyCosmic(index: number) {
		if (!$account || !gamepackId) return;

		const key = `cosmic-${index}`;
		buyingOrbs.set(key, true);
		try {
			console.log(`Buying cosmic orb ${index}...`);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await contracts.gb_contract_v2.buyCosmic($account, gamepackIdInt, index);
			console.log('✅ Cosmic orb bought!', result);
		} catch (err) {
			console.error('Failed to buy cosmic orb:', err);
			alert('Failed to buy cosmic orb');
		} finally {
			buyingOrbs.delete(key);
		}
	}

	async function nextLevel() {
		if (!$account || !gamepackId) return;

		nextingLevel = true;
		try {
			console.log('Advancing to next level...');
			const gamepackIdInt = parseInt(gamepackId);
			const result = await contracts.gb_contract_v2.nextLevel($account, gamepackIdInt);
			console.log('✅ Advanced to next level!', result);
		} catch (err) {
			console.error('Failed to advance level:', err);
			alert('Failed to advance level');
		} finally {
			nextingLevel = false;
		}
	}
</script>

<div class="min-h-screen p-8 bg-black text-white">
	<div class="mb-8">
		<a href="/gamepacks/{gamepackId}/game/{gameId}" class="text-sm opacity-60 hover:opacity-100">← BACK TO GAME</a>
	</div>

	<h1 class="text-4xl font-bold mb-8">SHOP</h1>

	{#if !$account}
		<div class="flex flex-col gap-4">
			<p class="opacity-60">Please connect your wallet to view shop</p>
			<a href="/" class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-center w-fit">
				Go Back and Connect
			</a>
		</div>
	{:else if loading}
		<p>Loading shop...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else}
		<div class="space-y-6">
			{#if game}
				<div class="bg-black/30 border border-white p-4 rounded-lg">
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
