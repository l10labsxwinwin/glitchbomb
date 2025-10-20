<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ToriiQueryBuilder, KeysClause } from '@dojoengine/sdk';
	import { getSDK, extractGamePacks, updateGamePacksList } from './torii_global.svelte';
	import { ModelsMapping, type GamePack } from './typescript/models.gen';
	import type { Subscription } from '@dojoengine/torii-client';

	let { playerId }: { playerId: string } = $props();

	let gamePacks = $state<GamePack[]>([]);
	let subscription: Subscription | null = null;

	onMount(async () => {
		const sdk = getSDK();
		if (!sdk) {
			console.error('SDK not initialized');
			return;
		}

		const [initialEntities, sub] = await sdk.subscribeEntityQuery({
			query: new ToriiQueryBuilder()
				.withClause(KeysClause([ModelsMapping.GamePack], [playerId], 'VariableLen').build())
				.includeHashedKeys(),
			callback: ({ data, error }) => {
				if (data) {
					data.forEach((entity) => {
						const gamePack = entity.models.glitchbomb.GamePack as GamePack;
						if (gamePack && gamePack.player_id) {
							gamePacks = updateGamePacksList(gamePacks, gamePack);
						}
					});
				}
				if (error) {
					console.error('GamePack subscription error:', error);
				}
			}
		});

		subscription = sub;
		gamePacks = extractGamePacks(initialEntities);
	});

	onDestroy(() => {
		if (subscription) {
			subscription.cancel();
		}
	});
</script>

<div>
	{#if gamePacks.length === 0}
		<p>No gamepacks found</p>
	{:else}
		{#each gamePacks as gamePack}
			<div>
				GamePack {gamePack.gamepack_id.toString()} - State: {typeof gamePack.state === 'string' ? gamePack.state : Object.keys(gamePack.state.variant)[0]} - Current Game ID: {gamePack.data.current_game_id.toString()} - Moonrocks: {gamePack.data.accumulated_moonrocks.toString()}
			</div>
		{/each}
	{/if}
</div>
