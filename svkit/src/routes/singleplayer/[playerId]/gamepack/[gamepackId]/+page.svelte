<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { gql } from '@apollo/client/core';
	import { SvelteMap } from 'svelte/reactivity';
	import { client } from '$lib/apollo';
	import { getGameKey, getOrbsKey } from '$lib/keys';
	import { account, dojoProvider } from '$lib/stores/burner';
	import { setupWorld } from '$lib/typescript/contracts.gen';
	import { toasts } from '$lib/stores/toast';
	import BurnerWalletBar from '$lib/components/BurnerWalletBar.svelte';
	import GameCard from '$lib/components/GameCard.svelte';

	const playerId = $derived($page.params.playerId);
	const gamepackId = $derived($page.params.gamepackId);
	
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

	interface OrbEffect {
		Point?: number;
		PointPerOrbRemaining?: number;
		PointPerBombPulled?: number;
		GlitchChips?: number;
		Moonrocks?: number;
		Health?: number;
		Bomb?: number;
		Multiplier?: number;
		BombImmunity?: number;
		option?: any;
	}

	interface GameData {
		level: number;
		pull_number: number;
		points: number;
		milestone: number;
		hp: number;
		multiplier: number;
		glitch_chips: number;
		moonrocks_spent: number;
		moonrocks_earned: number;
		temp_moonrocks: number;
		bomb_immunity_turns: number;
		bombs_pulled_in_level: number;
		pullable_orbs: OrbEffect[];
		consumed_orbs: OrbEffect[];
	}

	interface Game {
		player_id: string;
		gamepack_id: number;
		game_id: number;
		state: string;
		data: GameData;
	}

	interface OrbsInGame {
		player_id: string;
		gamepack_id: number;
		game_id: number;
		non_buyable: any[];
		common: any[];
		rare: any[];
		cosmic: any[];
	}

	const GET_GAMEPACK = gql`
		query GetGamepack($playerId: String!, $gamepackId: Int!) {
			glitchbombGamePackModels(where: { player_id: $playerId, gamepack_id: $gamepackId }) {
				edges {
					node {
						player_id
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

	const GET_GAMES = gql`
		query GetGames($playerId: String!, $gamepackId: Int!) {
			glitchbombGameModels(where: { player_id: $playerId, gamepack_id: $gamepackId }) {
				edges {
					node {
						player_id
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

	const GET_ORBS = gql`
		query GetOrbs($playerId: String!, $gamepackId: Int!) {
			glitchbombOrbsInGameModels(where: { player_id: $playerId, gamepack_id: $gamepackId }) {
				edges {
					node {
						player_id
						gamepack_id
						game_id
						non_buyable {
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
					... on glitchbomb_GamePack {
						player_id
						gamepack_id
						state
						data {
							current_game_id
							accumulated_moonrocks
						}
					}
					... on glitchbomb_Game {
						player_id
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
					... on glitchbomb_OrbsInGame {
						player_id
						gamepack_id
						game_id
						non_buyable {
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

	let gamepack = $state<GamePack | null>(null);
	let gameMap = new SvelteMap<string, Game>();
	let games = $derived(Array.from(gameMap.values()).sort((a, b) => b.game_id - a.game_id));
	let orbsMap = new SvelteMap<string, OrbsInGame>();
	let orbs = $derived(Array.from(orbsMap.values()));
	let loading = $state(true);
	let error = $state<string | null>(null);
	let subscription: any = null;
	let openingGamepack = $state(false);
	let startingGames = $state(new Map<number, boolean>());
	let pullingOrbs = $state(new Map<number, boolean>());
	let cashingOut = $state(false);
	let startingNextGame = $state(false);

	async function loadGamepackData() {
		if (!gamepackId || !accountReady) return;
		
		try {
			const gamepackIdInt = parseInt(gamepackId);

			const [gamepackResult, gamesResult, orbsResult] = await Promise.all([
				client.query({
					query: GET_GAMEPACK,
					variables: { playerId, gamepackId: gamepackIdInt },
					fetchPolicy: 'network-only'
				}),
				client.query({
					query: GET_GAMES,
					variables: { playerId, gamepackId: gamepackIdInt },
					fetchPolicy: 'network-only'
				}),
				client.query({
					query: GET_ORBS,
					variables: { playerId, gamepackId: gamepackIdInt },
					fetchPolicy: 'network-only'
				})
			]);

			const gamepackNodes =
				gamepackResult.data.glitchbombGamePackModels?.edges?.map((edge: any) => edge.node) || [];
			if (gamepackNodes.length > 0) {
				gamepack = gamepackNodes[0];
			}

			const gameNodes =
				gamesResult.data.glitchbombGameModels?.edges?.map((edge: any) => edge.node) || [];
			gameNodes.forEach((game: Game) => {
				gameMap.set(getGameKey(game.player_id, game.gamepack_id, game.game_id), game);
			});

			const orbNodes =
				orbsResult.data.glitchbombOrbsInGameModels?.edges?.map((edge: any) => edge.node) || [];
			orbNodes.forEach((orb: OrbsInGame) => {
				orbsMap.set(getOrbsKey(orb.player_id, orb.gamepack_id, orb.game_id), orb);
			});

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
									model.__typename === 'glitchbomb_GamePack' &&
									model.player_id === playerId &&
									model.gamepack_id === gamepackIdInt
								) {
									gamepack = model;
								} else if (
									model.__typename === 'glitchbomb_Game' &&
									model.player_id === playerId &&
									model.gamepack_id === gamepackIdInt
								) {
									const key = getGameKey(model.player_id, model.gamepack_id, model.game_id);
									gameMap.set(key, model);
								} else if (
									model.__typename === 'glitchbomb_OrbsInGame' &&
									model.player_id === playerId &&
									model.gamepack_id === gamepackIdInt
								) {
									const key = getOrbsKey(model.player_id, model.gamepack_id, model.game_id);
									orbsMap.set(key, model);
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
			loadGamepackData();
		}
	});

	onMount(() => {
		if (accountReady) {
			loadGamepackData();
		}
	});

	onDestroy(() => {
		if (subscription) {
			subscription.unsubscribe();
		}
	});

	async function openGamepack() {
		if (!$account || !$dojoProvider || !gamepackId) return;

		openingGamepack = true;
		try {
			console.log('Opening gamepack...');
			const world = setupWorld($dojoProvider);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await world.gb_contract_v2.openGamepack($account, gamepackIdInt);
			console.log('✅ Gamepack opened!', result);
			toasts.add('Gamepack opened successfully!', 'success');
		} catch (err) {
			console.error('Failed to open gamepack:', err);
			toasts.add('Failed to open gamepack', 'error');
		} finally {
			openingGamepack = false;
		}
	}

	async function startGame(gameId: number) {
		if (!$account || !$dojoProvider || !gamepackId) return;

		startingGames.set(gameId, true);
		try {
			console.log(`Starting game ${gameId}...`);
			const world = setupWorld($dojoProvider);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await world.gb_contract_v2.startGame($account, gamepackIdInt);
			console.log('✅ Game started!', result);
			toasts.add(`Game ${gameId} started successfully!`, 'success');
		} catch (err) {
			console.error('Failed to start game:', err);
			toasts.add('Failed to start game', 'error');
		} finally {
			startingGames.delete(gameId);
		}
	}

	async function pullOrb(gameId: number) {
		if (!$account || !$dojoProvider || !gamepackId) return;

		pullingOrbs.set(gameId, true);
		try {
			console.log(`Pulling orb for game ${gameId}...`);
			const world = setupWorld($dojoProvider);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await world.gb_contract_v2.pullOrb($account, gamepackIdInt);
			console.log('✅ Orb pulled!', result);
			toasts.add('Orb pulled successfully!', 'success');
		} catch (err) {
			console.error('Failed to pull orb:', err);
			toasts.add('Failed to pull orb', 'error');
		} finally {
			pullingOrbs.delete(gameId);
		}
	}

	async function cashOut() {
		if (!$account || !$dojoProvider || !gamepackId) return;

		cashingOut = true;
		try {
			console.log('Cashing out...');
			const world = setupWorld($dojoProvider);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await world.gb_contract_v2.cashOut($account, gamepackIdInt);
			console.log('✅ Cashed out!', result);
			toasts.add('Cashed out successfully!', 'success');
		} catch (err) {
			console.error('Failed to cash out:', err);
			toasts.add('Failed to cash out', 'error');
		} finally {
			cashingOut = false;
		}
	}

	async function nextGame() {
		if (!$account || !$dojoProvider || !gamepackId) return;

		startingNextGame = true;
		try {
			console.log('Starting next game...');
			const world = setupWorld($dojoProvider);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await world.gb_contract_v2.nextGame($account, gamepackIdInt);
			console.log('✅ Next game created!', result);
			toasts.add('Next game started! You can now play again.', 'success');
		} catch (err) {
			console.error('Failed to start next game:', err);
			toasts.add('Failed to start next game', 'error');
		} finally {
			startingNextGame = false;
		}
	}
</script>

<div class="min-h-screen flex flex-col">
	<div class="bg-black/50 border-b border-white/10 px-4 py-3">
		<div class="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
			<div class="flex items-center gap-4">
				<a href="/singleplayer" class="text-sm opacity-60 hover:opacity-100">← BACK</a>
				<span class="text-sm font-bold">GAMEPACK</span>
			</div>
			<BurnerWalletBar />
		</div>
	</div>

	<div class="flex-1 p-8">
		<div class="max-w-7xl mx-auto">

		{#if loading}
			<p>Loading...</p>
		{:else if error}
			<p class="text-red-500">Error: {error}</p>
		{:else if gamepack}
			<div class="space-y-8">
				<div>
					<h1 class="text-3xl font-bold mb-4">Gamepack {gamepackId}</h1>
					<div class="bg-black/30 border border-white/10 p-4 rounded-lg">
						<div class="grid grid-cols-2 gap-4 mb-4">
							<div>
								<div class="opacity-60 text-sm mb-1">State</div>
								<div>{gamepack.state}</div>
							</div>
							<div>
								<div class="opacity-60 text-sm mb-1">Current Game ID</div>
								<div>{gamepack.data.current_game_id}</div>
							</div>
							<div>
								<div class="opacity-60 text-sm mb-1">Accumulated Moonrocks</div>
								<div>{gamepack.data.accumulated_moonrocks}</div>
							</div>
						</div>
					<div class="flex gap-4">
						<button
							onclick={openGamepack}
							disabled={openingGamepack || gamepack.state !== 'Unopened'}
							class="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold"
						>
							{openingGamepack ? 'Opening...' : 'Open Gamepack'}
						</button>
						{#if gamepack.state === 'InProgress' && games.length > 0 && games[0].state === 'GameOver'}
							<button
								onclick={nextGame}
								disabled={startingNextGame}
								class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold"
							>
								{startingNextGame ? 'Starting...' : 'Start Next Game'}
							</button>
						{/if}
					</div>
					</div>
				</div>

				<div>
					<h2 class="text-2xl font-bold mb-4">Games ({games.length})</h2>
					{#if games.length > 0}
						<div class="space-y-4">
							{#each games as game}
								<GameCard
									{game}
									onStartGame={startGame}
									onPullOrb={pullOrb}
									onCashOut={cashOut}
									{startingGames}
									{pullingOrbs}
									{cashingOut}
								/>
							{/each}
						</div>
					{:else}
						<p class="opacity-60 text-sm">No games found</p>
					{/if}
				</div>

				<div>
					<h2 class="text-2xl font-bold mb-4">Orbs ({orbs.length})</h2>
					{#if orbs.length > 0}
						<div class="space-y-4">
							{#each orbs as orb}
								<div class="bg-black/30 border border-white/10 p-4 rounded-lg">
									<h3 class="font-bold mb-3">Game #{orb.game_id} Orbs</h3>
									<div class="grid grid-cols-4 gap-3 text-sm">
										<div>
											<div class="opacity-60">Non-Buyable:</div>
											<div>{orb.non_buyable.length}</div>
										</div>
										<div>
											<div class="opacity-60">Common:</div>
											<div>{orb.common.length}</div>
										</div>
										<div>
											<div class="opacity-60">Rare:</div>
											<div>{orb.rare.length}</div>
										</div>
										<div>
											<div class="opacity-60">Cosmic:</div>
											<div>{orb.cosmic.length}</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<p class="opacity-60 text-sm">No orbs found</p>
					{/if}
				</div>
			</div>
		{:else}
			<p class="opacity-60">Gamepack not found</p>
		{/if}
		</div>
	</div>
</div>
