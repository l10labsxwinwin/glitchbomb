<script lang="ts">
	import { page } from '$app/stores';
	import { getToriiState } from '$lib/torii_global.svelte';
	import type { GamePack } from '$lib/typescript/models.gen';

	const state = getToriiState();
	
	let gamePack: GamePack | undefined = $derived(
		state.gamePacks.find(
			(pack) =>
				pack.player_id === $page.params.playerId &&
				pack.gamepack_id.toString() === $page.params.gamepackId
		)
	);

	function getStateString(stateValue: any): string {
		if (typeof stateValue === 'string') {
			return stateValue;
		}
		if (stateValue?.variant) {
			return Object.keys(stateValue.variant)[0];
		}
		return 'Unknown';
	}
</script>

<div class="min-h-screen p-8">
	<h1 class="text-4xl font-bold mb-8">GamePack Details</h1>
	
	{#if gamePack}
		<div class="border border-gray-300 p-6 rounded-lg">
			<h2 class="text-2xl font-bold mb-4">GamePack {gamePack.gamepack_id.toString()}</h2>
			<div class="space-y-2">
				<p><span class="font-bold">Player ID:</span> {gamePack.player_id}</p>
				<p><span class="font-bold">GamePack ID:</span> {gamePack.gamepack_id.toString()}</p>
				<p><span class="font-bold">State:</span> {getStateString(gamePack.state)}</p>
				<p><span class="font-bold">Current Game ID:</span> {gamePack.data.current_game_id.toString()}</p>
				<p>
					<span class="font-bold">Accumulated Moonrocks:</span>
					{gamePack.data.accumulated_moonrocks.toString()}
				</p>
			</div>
		</div>
	{:else}
		<p>GamePack not found</p>
	{/if}
	
	<a href="/gamepacks" class="mt-8 inline-block text-blue-500 hover:underline">← Back to Game Packs</a>
</div>
