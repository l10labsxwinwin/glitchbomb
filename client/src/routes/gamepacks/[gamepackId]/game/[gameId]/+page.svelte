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
	import SingleGameStats from '$lib/components/SingleGameStats.svelte';
	import InLevelActions from '$lib/components/InLevelActions.svelte';
	import PullableOrbsView from '$lib/components/PullableOrbsView.svelte';
	import RecentPulls from '$lib/components/RecentPulls.svelte';

	const gamepackId = $derived($page.params.gamepackId);
	const gameId = $derived($page.params.gameId);

	const RPC_URL = 'https://api.cartridge.gg/x/starknet/sepolia';
	const dojoConfig = createDojoConfig({ manifest });
	const provider = new DojoProvider(dojoConfig.manifest, RPC_URL);
	const contracts = setupWorld(provider);

	$effect(() => {
		if (game && game.state === 'Shop') {
			goto(`/gamepacks/${gamepackId}/game/${gameId}/shop`);
		} else if (game && game.state === 'GameOver') {
			goto(`/gamepacks/${gamepackId}/game/${gameId}/gameover`);
		}
	});

	const GET_GAMEPACK = gql`
		query GetGamepack($gamepackId: Int!) {
			glitchbombGamePackModels(where: { gamepack_id: $gamepackId }) {
				edges {
					node {
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

	const GET_GAME = gql`
		query GetGame($gamepackId: Int!, $gameId: Int!) {
			glitchbombGameModels(where: { gamepack_id: $gamepackId, game_id: $gameId }) {
				edges {
					node {
						gamepack_id
						game_id
						state
						data {
							level
							pull_number
							points
							milestone
							hp
							multiplier
							glitch_chips
							moonrocks_spent
							moonrocks_earned
							temp_moonrocks
							bomb_immunity_turns
							bombs_pulled_in_level
							pullable_orbs {
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
							consumed_orbs {
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
					... on GLITCHBOMB_GamePack {
						gamepack_id
						state
						data {
							current_game_id
							accumulated_moonrocks
						}
					}
					... on GLITCHBOMB_Game {
						gamepack_id
						game_id
						state
						data {
							level
							pull_number
							points
							milestone
							hp
							multiplier
							glitch_chips
							moonrocks_spent
							moonrocks_earned
							temp_moonrocks
							bomb_immunity_turns
							bombs_pulled_in_level
							pullable_orbs {
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
							consumed_orbs {
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

	let gamepack = $state<any | null>(null);
	let game = $state<any | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let subscription: any = null;

	async function loadGameData() {
		if (!gameId || !gamepackId || !$account) return;

		try {
			const gamepackIdInt = parseInt(gamepackId);
			const gameIdInt = parseInt(gameId);

			const [gamepackResult, gameResult] = await Promise.all([
				client.query({
					query: GET_GAMEPACK,
					variables: { gamepackId: gamepackIdInt },
					fetchPolicy: 'network-only'
				}),
				client.query({
					query: GET_GAME,
					variables: { gamepackId: gamepackIdInt, gameId: gameIdInt },
					fetchPolicy: 'network-only'
				})
			]);

			const gamepackNodes =
				(gamepackResult.data as any).glitchbombGamePackModels?.edges?.map((edge: any) => edge.node) || [];
			if (gamepackNodes.length > 0) {
				gamepack = gamepackNodes[0];
			}

			const gameNodes =
				(gameResult.data as any).glitchbombGameModels?.edges?.map((edge: any) => edge.node) || [];
			if (gameNodes.length > 0) {
				game = gameNodes[0];
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
										model.__typename === 'GLITCHBOMB_GamePack' &&
										model.gamepack_id === gamepackIdInt
									) {
										gamepack = model;
									} else if (
										model.__typename === 'GLITCHBOMB_Game' &&
										model.gamepack_id === gamepackIdInt &&
										model.game_id === gameIdInt
									) {
										game = model;
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
			loadGameData();
		}
	});

	onMount(() => {
		if ($account) {
			loadGameData();
		}
	});

	onDestroy(() => {
		if (subscription) {
			subscription.unsubscribe();
		}
	});

	let openingGamepack = $state(false);
	let startingGame = $state(false);
	let pullingOrb = $state(false);
	let cashingOut = $state(false);
	let enteringShop = $state(false);

	async function openGamepack() {
		if (!$account || !gamepackId) return;

		openingGamepack = true;
		try {
			console.log('Opening gamepack...');
			const gamepackIdInt = parseInt(gamepackId);
			const result = await contracts.gb_contract_v2.openGamepack($account, gamepackIdInt);
			console.log('✅ Gamepack opened!', result);
		} catch (err) {
			console.error('Failed to open gamepack:', err);
			alert('Failed to open gamepack');
		} finally {
			openingGamepack = false;
		}
	}

	async function startGame() {
		if (!$account || !gamepackId) return;

		startingGame = true;
		try {
			console.log('Starting game...');
			const gamepackIdInt = parseInt(gamepackId);
			const result = await contracts.gb_contract_v2.startGame($account, gamepackIdInt);
			console.log('✅ Game started!', result);
		} catch (err) {
			console.error('Failed to start game:', err);
			alert('Failed to start game');
		} finally {
			startingGame = false;
		}
	}

	async function pullOrb() {
		if (!$account || !gamepackId) return;

		pullingOrb = true;
		try {
			console.log('Pulling orb...');
			const gamepackIdInt = parseInt(gamepackId);
			const result = await contracts.gb_contract_v2.pullOrb($account, gamepackIdInt);
			console.log('✅ Orb pulled!', result);
		} catch (err) {
			console.error('Failed to pull orb:', err);
			alert('Failed to pull orb');
		} finally {
			pullingOrb = false;
		}
	}

	async function cashOut() {
		if (!$account || !gamepackId) return;

		cashingOut = true;
		try {
			console.log('Cashing out...');
			const gamepackIdInt = parseInt(gamepackId);
			const result = await contracts.gb_contract_v2.cashOut($account, gamepackIdInt);
			console.log('✅ Cashed out!', result);
		} catch (err) {
			console.error('Failed to cash out:', err);
			alert('Failed to cash out');
		} finally {
			cashingOut = false;
		}
	}

	async function enterShop() {
		if (!$account || !gamepackId) return;

		enteringShop = true;
		try {
			console.log('Entering shop...');
			const gamepackIdInt = parseInt(gamepackId);
			const result = await contracts.gb_contract_v2.enterShop($account, gamepackIdInt);
			console.log('✅ Entered shop!', result);
		} catch (err) {
			console.error('Failed to enter shop:', err);
			alert('Failed to enter shop');
		} finally {
			enteringShop = false;
		}
	}
</script>

<div class="min-h-screen p-8 bg-black text-white">
	<div class="mb-8">
		<a href="/gamepacks/{gamepackId}" class="text-sm opacity-60 hover:opacity-100">← BACK TO GAMEPACK</a>
	</div>

	<h1 class="text-4xl font-bold mb-8">GAME {gameId}</h1>

	{#if !$account}
		<div class="flex flex-col gap-4">
			<p class="opacity-60">Please connect your wallet to view game</p>
			<a href="/" class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-center w-fit">
				Go Back and Connect
			</a>
		</div>
	{:else if loading}
		<p>Loading game data...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else if gamepack?.state === 'Unopened'}
		<div class="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
			<p class="text-xl opacity-60 mb-4">Gamepack is unopened</p>
			<button
				onclick={openGamepack}
				disabled={openingGamepack}
				class="px-12 py-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-2xl"
			>
				{openingGamepack ? 'Opening...' : 'Open Gamepack'}
			</button>
		</div>
	{:else if game?.state === 'New'}
		<div class="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
			<p class="text-xl opacity-60 mb-4">Game is ready to start</p>
			<button
				onclick={startGame}
				disabled={startingGame}
				class="px-12 py-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-2xl"
			>
				{startingGame ? 'Starting...' : 'Start Game'}
			</button>
		</div>
	{:else if game}
		<div class="space-y-6">
			<SingleGameStats {game} />
			<InLevelActions onPullOrb={pullOrb} onCashOut={cashOut} onEnterShop={enterShop} {pullingOrb} {cashingOut} {enteringShop} />
			<PullableOrbsView pullableOrbs={game.data.pullable_orbs} {pullingOrb} />
			<RecentPulls consumedOrbs={game.data.consumed_orbs} />
		</div>
	{:else}
		<p class="opacity-60">No data available</p>
	{/if}
</div>
