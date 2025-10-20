<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { GamePack } from '$lib/typescript/models.gen';
	import type { Subscription } from '@dojoengine/torii-client';
	import {
		initializePlayerGamePackSubscription,
		cleanupSubscription
	} from '$lib/dojo_state_helpers';
	import SimpleGamePackView from './SimpleGamePackView.svelte';

	let { playerId }: { playerId: string } = $props();

	let gamePacks = $state<GamePack[]>([]);
	let subscription: Subscription | null = null;

	const sortedGamePacks = $derived(
		[...gamePacks].sort((a, b) => Number(b.gamepack_id) - Number(a.gamepack_id))
	);

	onMount(async () => {
		subscription = await initializePlayerGamePackSubscription(playerId, (packs) => {
			gamePacks = packs;
		});
	});

	onDestroy(() => {
		cleanupSubscription(subscription);
	});
</script>

<div>
	{#if sortedGamePacks.length === 0}
		<p>No gamepacks found</p>
	{:else}
		<div class="flex flex-wrap gap-4">
			{#each sortedGamePacks as gamePack}
				<SimpleGamePackView {gamePack} />
			{/each}
		</div>
	{/if}
</div>
