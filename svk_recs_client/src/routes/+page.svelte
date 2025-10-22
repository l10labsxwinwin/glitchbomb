<script lang="ts">
	import { onMount } from 'svelte';
	import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client/core';

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

	const client = new ApolloClient({
		link: new HttpLink({
			uri: 'http://localhost:8080/graphql'
		}),
		cache: new InMemoryCache()
	});

	const GET_GLITCHBOMB_DATA = gql`
		query GetGlitchbombData {
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
			glitchbombGamePackModels {
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
			glitchbombGameModels {
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
						}
					}
				}
			}
			glitchbombOrbsInGameModels {
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

	let players = $state<Player[]>([]);
	let gamepacks = $state<GamePack[]>([]);
	let games = $state<Game[]>([]);
	let orbs = $state<OrbsInGame[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			const result = await client.query({
				query: GET_GLITCHBOMB_DATA
			});

			players = result.data.glitchbombPlayerModels?.edges?.map((edge: any) => edge.node) || [];
			gamepacks = result.data.glitchbombGamePackModels?.edges?.map((edge: any) => edge.node) || [];
			games = result.data.glitchbombGameModels?.edges?.map((edge: any) => edge.node) || [];
			orbs = result.data.glitchbombOrbsInGameModels?.edges?.map((edge: any) => edge.node) || [];
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch data';
			loading = false;
		}
	});
</script>

<div class="min-h-screen p-8">
	<h1 class="text-4xl font-bold mb-8">GLITCHBOMB</h1>

	{#if loading}
		<p>Loading...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else}
		<div class="space-y-8">
			<section>
				<h2 class="text-2xl font-bold mb-4">PLAYERS ({players.length})</h2>
				{#if players.length === 0}
					<p class="opacity-60">No players found</p>
				{:else}
					<div class="grid gap-4">
						{#each players as player}
							<div class="border border-white p-4">
								<div class="grid grid-cols-2 gap-2 text-sm">
									<div><span class="opacity-60">Player ID:</span> {player.player_id}</div>
									<div><span class="opacity-60">State:</span> {player.state}</div>
									<div><span class="opacity-60">USDC:</span> {player.data.usdc}</div>
									<div><span class="opacity-60">Gamepacks Bought:</span> {player.data.gamepacks_bought}</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<section>
				<h2 class="text-2xl font-bold mb-4">GAMEPACKS ({gamepacks.length})</h2>
				{#if gamepacks.length === 0}
					<p class="opacity-60">No gamepacks found</p>
				{:else}
					<div class="grid gap-4">
						{#each gamepacks as gamepack}
							<div class="border border-white p-4">
								<div class="grid grid-cols-2 gap-2 text-sm">
									<div><span class="opacity-60">Player ID:</span> {gamepack.player_id}</div>
									<div><span class="opacity-60">Gamepack ID:</span> {gamepack.gamepack_id}</div>
									<div><span class="opacity-60">State:</span> {gamepack.state}</div>
									<div><span class="opacity-60">Current Game ID:</span> {gamepack.data.current_game_id}</div>
									<div><span class="opacity-60">Accumulated Moonrocks:</span> {gamepack.data.accumulated_moonrocks}</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<section>
				<h2 class="text-2xl font-bold mb-4">GAMES ({games.length})</h2>
				{#if games.length === 0}
					<p class="opacity-60">No games found</p>
				{:else}
					<div class="grid gap-4">
						{#each games as game}
							<div class="border border-white p-4">
								<div class="grid grid-cols-2 gap-2 text-sm">
									<div><span class="opacity-60">Player ID:</span> {game.player_id}</div>
									<div><span class="opacity-60">Game ID:</span> {game.game_id}</div>
									<div><span class="opacity-60">Gamepack ID:</span> {game.gamepack_id}</div>
									<div><span class="opacity-60">State:</span> {game.state}</div>
									<div><span class="opacity-60">Level:</span> {game.data.level}</div>
									<div><span class="opacity-60">Points:</span> {game.data.points}</div>
									<div><span class="opacity-60">HP:</span> {game.data.hp}</div>
									<div><span class="opacity-60">Multiplier:</span> {game.data.multiplier}</div>
									<div><span class="opacity-60">Pull Number:</span> {game.data.pull_number}</div>
									<div><span class="opacity-60">Milestone:</span> {game.data.milestone}</div>
									<div><span class="opacity-60">Glitch Chips:</span> {game.data.glitch_chips}</div>
									<div><span class="opacity-60">Moonrocks Spent:</span> {game.data.moonrocks_spent}</div>
									<div><span class="opacity-60">Moonrocks Earned:</span> {game.data.moonrocks_earned}</div>
									<div><span class="opacity-60">Temp Moonrocks:</span> {game.data.temp_moonrocks}</div>
									<div><span class="opacity-60">Bomb Immunity:</span> {game.data.bomb_immunity_turns}</div>
									<div><span class="opacity-60">Bombs in Level:</span> {game.data.bombs_pulled_in_level}</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<section>
				<h2 class="text-2xl font-bold mb-4">ORBS ({orbs.length})</h2>
				{#if orbs.length === 0}
					<p class="opacity-60">No orbs found</p>
				{:else}
					<div class="grid gap-4">
						{#each orbs as orb}
							<div class="border border-white p-4">
								<div class="grid grid-cols-2 gap-2 text-sm mb-2">
									<div><span class="opacity-60">Player ID:</span> {orb.player_id}</div>
									<div><span class="opacity-60">Game ID:</span> {orb.game_id}</div>
									<div><span class="opacity-60">Gamepack ID:</span> {orb.gamepack_id}</div>
								</div>
								<div class="grid grid-cols-4 gap-2 text-sm mt-2">
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
				{/if}
			</section>
		</div>
	{/if}
</div>

