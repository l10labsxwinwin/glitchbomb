<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { gql } from '@apollo/client/core';
	import { client } from '$lib/apollo';
	import { account, dojoProvider } from '$lib/stores/burner';
	import { setupWorld } from '$lib/typescript/contracts.gen';
	import { toasts } from '$lib/stores/toast';
	import GameOverStats from '$lib/components/GameOverStats.svelte';
	import InGameOverActions from '$lib/components/InGameOverActions.svelte';

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

	$effect(() => {
		if (gamepack && gameId) {
			const currentGameId = gamepack.data?.current_game_id;
			const currentRouteGameId = parseInt(gameId);
			
			if (currentGameId && currentGameId !== currentRouteGameId) {
				goto(`/singleplayer/${playerId}/gamepack/${gamepackId}/game/${currentGameId}`);
			}
		}
	});

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
							moonrocks_spent
							moonrocks_earned
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
							moonrocks_spent
							moonrocks_earned
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
	let startingNextGame = $state(false);

	async function loadGameData() {
		if (!gameId || !gamepackId || !accountReady) return;

		try {
			const gamepackIdInt = parseInt(gamepackId);
			const gameIdInt = parseInt(gameId);

			const [gamepackResult, gameResult] = await Promise.all([
				client.query({
					query: GET_GAMEPACK,
					variables: { playerId, gamepackId: gamepackIdInt },
					fetchPolicy: 'network-only'
				}),
				client.query({
					query: GET_GAME,
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

	async function startNextGame() {
		if (!$account || !$dojoProvider || !gamepackId) return;

		startingNextGame = true;
		try {
			console.log('Starting next game...');
			const world = setupWorld($dojoProvider);
			const gamepackIdInt = parseInt(gamepackId);
			
			const nextGameResult = await world.gb_contract_v2.nextGame($account, gamepackIdInt);
			console.log('✅ Next game created!', nextGameResult);
			
			toasts.add('Next game created successfully!', 'success');
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
				<span class="text-sm font-bold">GAME OVER</span>
			</div>
		</div>
	</div>

	<div class="flex-1 p-8">
		<div class="max-w-7xl mx-auto max-w-2xl">
			{#if loading}
				<p>Loading...</p>
			{:else if error}
				<p class="text-red-500">Error: {error}</p>
			{:else}
				<div class="space-y-6">
					<GameOverStats {gamepack} {game} />
					<InGameOverActions onStartNextGame={startNextGame} {startingNextGame} />
				</div>
			{/if}
		</div>
	</div>
</div>
