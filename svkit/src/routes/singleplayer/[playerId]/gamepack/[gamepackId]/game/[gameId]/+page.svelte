<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { gql } from '@apollo/client/core';
	import { client } from '$lib/apollo';
	import { account, dojoProvider } from '$lib/stores/burner';
	import { setupWorld } from '$lib/typescript/contracts.gen';
	import { toasts } from '$lib/stores/toast';
	import FullSingleGame from '$lib/components/FullSingleGame.svelte';

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

	let gamepack = $state<GamePack | null>(null);
	let game = $state<Game | null>(null);
	let orbs = $state<OrbsInGame | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let subscription: any = null;

	async function loadGameData() {
		if (!gameId || !gamepackId || !accountReady) return;

		try {
			const gamepackIdInt = parseInt(gamepackId);
			const gameIdInt = parseInt(gameId);

			const [gamepackResult, gameResult, orbsResult] = await Promise.all([
				client.query({
					query: GET_GAMEPACK,
					variables: { playerId, gamepackId: gamepackIdInt },
					fetchPolicy: 'network-only'
				}),
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

			const gamepackNodes =
				gamepackResult.data.glitchbombGamePackModels?.edges?.map((edge: any) => edge.node) || [];
			if (gamepackNodes.length > 0) {
				gamepack = gamepackNodes[0];
			}

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
									model.__typename === 'glitchbomb_GamePack' &&
									model.player_id === playerId &&
									model.gamepack_id === gamepackIdInt
								) {
									gamepack = model;
								} else if (
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
			loadGameData();
		}
	});

	onMount(() => {
		if (accountReady) {
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

	async function startGame() {
		if (!$account || !$dojoProvider || !gamepackId) return;

		startingGame = true;
		try {
			console.log('Starting game...');
			const world = setupWorld($dojoProvider);
			const gamepackIdInt = parseInt(gamepackId);
			const result = await world.gb_contract_v2.startGame($account, gamepackIdInt);
			console.log('✅ Game started!', result);
			toasts.add('Game started successfully!', 'success');
		} catch (err) {
			console.error('Failed to start game:', err);
			toasts.add('Failed to start game', 'error');
		} finally {
			startingGame = false;
		}
	}
</script>

<FullSingleGame {gamepack} {game} {orbs} {loading} {error} {openGamepack} {startGame} {openingGamepack} {startingGame} />
