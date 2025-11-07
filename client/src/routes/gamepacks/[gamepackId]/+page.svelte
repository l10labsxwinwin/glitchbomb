<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { gql } from '@apollo/client/core';
	import { SvelteMap } from 'svelte/reactivity';
	import { client } from '$lib/apollo';
	import { account } from '$lib/stores/controller';

	const gamepackId = $derived($page.params.gamepackId);

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
		gamepack_id: number;
		game_id: number;
		state: string;
		data: GameData;
	}

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
						entity {
							keys
						}
					}
				}
			}
		}
	`;

	const GET_GAMES = gql`
		query GetGames($gamepackId: Int!) {
			glitchbombGameModels(where: { gamepack_id: $gamepackId }) {
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

	let gamepack = $state<GamePack | null>(null);
	let gameMap = new SvelteMap<number, Game>();
	let games = $derived(Array.from(gameMap.values()).sort((a, b) => b.game_id - a.game_id));
	let loading = $state(true);
	let error = $state<string | null>(null);
	let subscription: any = null;

	async function loadGamepackData() {
		if (!gamepackId || !$account) return;

		try {
			const gamepackIdInt = parseInt(gamepackId);

			const [gamepackResult, gamesResult] = await Promise.all([
				client.query({
					query: GET_GAMEPACK,
					variables: { gamepackId: gamepackIdInt },
					fetchPolicy: 'network-only'
				}),
				client.query({
					query: GET_GAMES,
					variables: { gamepackId: gamepackIdInt },
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
				gameMap.set(game.game_id, game);
			});

			loading = false;

			if (!subscription) {
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
										model.__typename === 'GLITCHBOMB_GamePack' &&
										model.gamepack_id === gamepackIdInt
									) {
										gamepack = model;
									} else if (
										model.__typename === 'GLITCHBOMB_Game' &&
										model.gamepack_id === gamepackIdInt
									) {
										gameMap.set(model.game_id, model);
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
			loadGamepackData();
		}
	});

	onMount(() => {
		if ($account) {
			loadGamepackData();
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
		<a href="/gamepacks" class="text-sm opacity-60 hover:opacity-100">← BACK TO GAMEPACKS</a>
	</div>

	<h1 class="text-4xl font-bold mb-8">GAMEPACK {gamepackId}</h1>

	{#if !$account}
		<div class="flex flex-col gap-4">
			<p class="opacity-60">Please connect your wallet to view gamepack details</p>
			<a href="/" class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-center w-fit">
				Go Back and Connect
			</a>
		</div>
	{:else if loading}
		<p>Loading gamepack data...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else if gamepack}
		<div class="space-y-8">
			<div class="bg-black/30 border border-white p-6 rounded-lg">
				<h2 class="text-2xl font-bold mb-4">Gamepack Details</h2>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<div class="opacity-60 text-sm mb-1">State</div>
						<div class="font-bold">{gamepack.state}</div>
					</div>
					<div>
						<div class="opacity-60 text-sm mb-1">Current Game ID</div>
						<div class="font-bold">{gamepack.data.current_game_id}</div>
					</div>
					<div>
						<div class="opacity-60 text-sm mb-1">Accumulated Moonrocks</div>
						<div class="font-bold">{gamepack.data.accumulated_moonrocks}</div>
					</div>
				</div>
			</div>

			<div>
				<h2 class="text-2xl font-bold mb-4">Games ({games.length})</h2>
				{#if games.length > 0}
					<div class="space-y-4">
						{#each games as game}
							<a href="/gamepacks/{gamepackId}/game/{game.game_id}" class="block bg-black/30 border border-white p-6 rounded-lg hover:bg-white hover:text-black transition-colors cursor-pointer">
								<div class="flex justify-between items-start mb-4">
									<div>
										<h3 class="text-xl font-bold">Game {game.game_id}</h3>
										<div class="text-sm opacity-60">State: {game.state}</div>
									</div>
								</div>
								<div class="grid grid-cols-3 gap-4 text-sm">
									<div>
										<div class="opacity-60 mb-1">Level</div>
										<div class="font-bold">{game.data.level}</div>
									</div>
									<div>
										<div class="opacity-60 mb-1">Points</div>
										<div class="font-bold">{game.data.points}</div>
									</div>
									<div>
										<div class="opacity-60 mb-1">HP</div>
										<div class="font-bold">{game.data.hp}</div>
									</div>
									<div>
										<div class="opacity-60 mb-1">Multiplier</div>
										<div class="font-bold">{game.data.multiplier}</div>
									</div>
									<div>
										<div class="opacity-60 mb-1">Glitch Chips</div>
										<div class="font-bold">{game.data.glitch_chips}</div>
									</div>
									<div>
										<div class="opacity-60 mb-1">Temp Moonrocks</div>
										<div class="font-bold">{game.data.temp_moonrocks}</div>
									</div>
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<p class="opacity-60 text-sm">No games found for this gamepack</p>
				{/if}
			</div>
		</div>
	{:else}
		<p class="opacity-60">Gamepack not found</p>
	{/if}
</div>
