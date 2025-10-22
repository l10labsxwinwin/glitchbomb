<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gql } from '@apollo/client/core';
	import { client } from '$lib/apollo';

	interface OrbsInGame {
		player_id: string;
		gamepack_id: number;
		game_id: number;
		non_buyable: any[];
		common: any[];
		rare: any[];
		cosmic: any[];
	}

	const GET_ORBS = gql`
		query GetOrbs {
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

	const ENTITY_UPDATED = gql`
		subscription EntityUpdated {
			entityUpdated {
				id
				keys
				models {
					__typename
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

	let orbs = $state<OrbsInGame[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let subscription: any = null;

	onMount(async () => {
		try {
			const result = await client.query({
				query: GET_ORBS,
				fetchPolicy: 'network-only'
			});

			orbs = result.data.glitchbombOrbsInGameModels?.edges?.map((edge: any) => edge.node) || [];
			loading = false;

			subscription = client.subscribe({
				query: ENTITY_UPDATED
			}).subscribe({
				next: (data) => {
					if (data.data?.entityUpdated?.models) {
						const models = data.data.entityUpdated.models;
						models.forEach((model: any) => {
							if (model.__typename === 'glitchbomb_OrbsInGame') {
								const index = orbs.findIndex(o => 
									o.player_id === model.player_id && 
									o.gamepack_id === model.gamepack_id && 
									o.game_id === model.game_id
								);
								if (index !== -1) {
									orbs[index] = model;
								} else {
									orbs = [...orbs, model];
								}
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

	<h1 class="text-4xl font-bold mb-8">ORBS</h1>

	{#if loading}
		<p>Loading...</p>
	{:else if error}
		<p class="text-red-500">Error: {error}</p>
	{:else if orbs.length === 0}
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
</div>
