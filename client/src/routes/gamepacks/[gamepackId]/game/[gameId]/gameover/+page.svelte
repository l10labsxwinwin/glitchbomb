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
	import GameOverStats from '$lib/components/GameOverStats.svelte';
	import InGameOverActions from '$lib/components/InGameOverActions.svelte';

	const gamepackId = $derived($page.params.gamepackId);
	const gameId = $derived($page.params.gameId);

	const RPC_URL = 'https://api.cartridge.gg/x/starknet/sepolia';
	const dojoConfig = createDojoConfig({ manifest });
	const provider = new DojoProvider(dojoConfig.manifest, RPC_URL);
	const contracts = setupWorld(provider);

	$effect(() => {
		if (gamepack && gameId) {
			const currentGameId = gamepack.data?.current_game_id;
			const currentRouteGameId = parseInt(gameId);
			
			if (currentGameId && currentGameId !== currentRouteGameId) {
				goto(`/gamepacks/${gamepackId}/game/${currentGameId}`);
			}
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

	async function startNextGame() {
		if (!$account || !gamepackId) return;

		startingNextGame = true;
		try {
			console.log('Starting next game...');
			const gamepackIdInt = parseInt(gamepackId);
			
			const nextGameResult = await contracts.gb_contract_v2.nextGame($account, gamepackIdInt);
			console.log('✅ Next game created!', nextGameResult);
		} catch (err) {
			console.error('Failed to start next game:', err);
			alert('Failed to start next game');
		} finally {
			startingNextGame = false;
		}
	}
</script>

<div class="min-h-screen p-8 bg-black text-white">
	<div class="mb-8">
		<a href="/gamepacks/{gamepackId}" class="text-sm opacity-60 hover:opacity-100">← BACK TO GAMEPACK</a>
	</div>

	<div class="max-w-2xl mx-auto">
		{#if !$account}
			<div class="flex flex-col gap-4">
				<p class="opacity-60">Please connect your wallet to view game over stats</p>
				<a href="/" class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-center w-fit">
					Go Back and Connect
				</a>
			</div>
		{:else if loading}
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
