<script lang="ts">
	import { onMount } from 'svelte';
	import { gql } from '@apollo/client/core';
	import { client } from '$lib/apollo';

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

	const GET_GAMEPACKS = gql`
		query GetGamePacks {
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
		}
	`;

	let gamepacks = $state<GamePack[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			const result = await client.query({
				query: GET_GAMEPACKS
			});

			gamepacks = result.data.glitchbombGamePackModels?.edges?.map((edge: any) => edge.node) || [];
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch data';
			loading = false;
		}
	});
</script>

<div class="min-h-screen p-8">
	<div class="mb-8">
		<a href="/" class="text-sm opacity-60 hover:opacity-100">← BACK</a>
	</div>

	<h1 class="text-4xl font-bold mb-8">GAMEPACKS</h1>

	{#if loading}
		<p>Loading...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else if gamepacks.length === 0}
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
</div>
