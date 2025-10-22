<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gql } from '@apollo/client/core';
	import { SvelteMap } from 'svelte/reactivity';
	import { client } from '$lib/apollo';
	import { getPlayerKey } from '$lib/keys';

	interface PlayerData {
		usdc: number;
		gamepacks_bought: number;
	}

	interface Player {
		player_id: string;
		state: string;
		data: PlayerData;
	}

	const GET_PLAYERS = gql`
		query GetPlayers {
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
		}
	`;

	const ENTITY_UPDATED = gql`
		subscription EntityUpdated {
			entityUpdated {
				id
				keys
				models {
					__typename
					... on glitchbomb_Player {
						player_id
						state
						data {
							usdc
							gamepacks_bought
						}
					}
				}
			}
		}
	`;

	let playerMap = $state(new SvelteMap<string, Player>());
	let players = $derived(Array.from(playerMap.values()));
	let loading = $state(true);
	let error = $state<string | null>(null);
	let subscription: any = null;

	onMount(async () => {
		try {
			const result = await client.query({
				query: GET_PLAYERS,
				fetchPolicy: 'network-only'
			});

			const nodes = result.data.glitchbombPlayerModels?.edges?.map((edge: any) => edge.node) || [];
			nodes.forEach((player: Player) => {
				playerMap.set(getPlayerKey(player.player_id), player);
			});
			loading = false;

			subscription = client.subscribe({
				query: ENTITY_UPDATED
			}).subscribe({
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

	<h1 class="text-4xl font-bold mb-8">PLAYERS</h1>

	{#if loading}
		<p>Loading...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else if players.length === 0}
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
</div>
