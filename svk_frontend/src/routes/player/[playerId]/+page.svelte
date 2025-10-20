<script lang="ts">
	import { page } from '$app/stores';
	import { getToriiState } from '$lib/torii_global.svelte';
	import PlayerStats from '$lib/PlayerStats.svelte';
	import type { Player } from '$lib/typescript/models.gen';

	const state = getToriiState();
	
	let player: Player | undefined = $derived(
		state.players.find((p) => p.player_id === $page.params.playerId)
	);
</script>

<div class="min-h-screen p-8">
	<h1 class="text-4xl font-bold mb-8">Player Details</h1>
	
	{#if player}
		<PlayerStats {player} />
	{:else}
		<p>Player not found</p>
	{/if}
	
	<a href="/players" class="mt-8 inline-block text-blue-500 hover:underline">← Back to Players</a>
</div>
