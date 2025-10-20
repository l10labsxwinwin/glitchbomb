<script lang="ts">
	import { getToriiState } from './torii_global.svelte';

	const state = getToriiState();

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

<div class="game-packs">
	<h2 class="text-2xl font-bold mb-4">Game Packs</h2>
	{#if state.gamePacks.length === 0}
		<p>No game packs available</p>
	{:else}
		<div class="grid gap-4">
			{#each state.gamePacks as gamePack}
				<div class="game-pack-card border p-4 rounded">
					<p><strong>Player ID:</strong> {gamePack.player_id}</p>
					<p><strong>GamePack ID:</strong> {gamePack.gamepack_id.toString()}</p>
					<p><strong>State:</strong> {getStateString(gamePack.state)}</p>
					<p><strong>Current Game ID:</strong> {gamePack.data.current_game_id.toString()}</p>
					<p>
						<strong>Accumulated Moonrocks:</strong>
						{gamePack.data.accumulated_moonrocks.toString()}
					</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
