<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gql } from '@apollo/client/core';
	import { SvelteMap } from 'svelte/reactivity';
	import { client } from '$lib/apollo';
	import { getGameKey } from '$lib/keys';

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

	const GET_GAMES = gql`
		query GetGames {
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
		}
	`;

	let gameMap = $state(new SvelteMap<string, Game>());
	let games = $derived(Array.from(gameMap.values()));
	let loading = $state(true);
	let error = $state<string | null>(null);
	let subscription: any = null;

	onMount(async () => {
		try {
			const result = await client.query({
				query: GET_GAMES,
				fetchPolicy: 'network-only'
			});

			const nodes = result.data.glitchbombGameModels?.edges?.map((edge: any) => edge.node) || [];
			nodes.forEach((game: Game) => {
				gameMap.set(getGameKey(game.player_id, game.gamepack_id, game.game_id), game);
			});
			loading = false;

			subscription = client.subscribe({
				query: ENTITY_UPDATED
			}).subscribe({
				next: (data) => {
					if (data.data?.entityUpdated?.models) {
						const models = data.data.entityUpdated.models;
						models.forEach((model: any) => {
							if (model.__typename === 'glitchbomb_Game') {
								const key = getGameKey(model.player_id, model.gamepack_id, model.game_id);
								gameMap.set(key, model);
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
	});

	onDestroy(() => {
		if (subscription) {
			subscription.unsubscribe();
		}
	});
</script>

<div class="min-h-screen p-8">
	<div class="mb-8">
		<a href="/" class="text-sm opacity-60 hover:opacity-100">← BACK</a>
	</div>

	<h1 class="text-4xl font-bold mb-8">GAMES</h1>

	{#if loading}
		<p>Loading...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else if games.length === 0}
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
</div>
