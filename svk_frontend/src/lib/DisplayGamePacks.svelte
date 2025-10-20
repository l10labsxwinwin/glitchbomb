<script lang="ts">
	import { getToriiState } from './torii_global.svelte';
	import type { GamePack } from './typescript/models.gen';

	const state = getToriiState();

	const sortedGamePacks = $derived(
		[...state.gamePacks].sort((a, b) => {
			const playerCompare = a.player_id.localeCompare(b.player_id);
			if (playerCompare !== 0) return playerCompare;
			return Number(b.gamepack_id) - Number(a.gamepack_id);
		})
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

	function shortenPlayerId(playerId: string): string {
		if (playerId.length <= 10) return playerId;
		return `${playerId.slice(0, 6)}...${playerId.slice(-4)}`;
	}
</script>

<div>
	{#if sortedGamePacks.length === 0}
		<p>No game packs available</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead>
					<tr class="border-b border-gray-300">
						<th class="text-left py-2 px-4">Player ID</th>
						<th class="text-left py-2 px-4">GamePack ID</th>
						<th class="text-left py-2 px-4">State</th>
						<th class="text-left py-2 px-4">Current Game ID</th>
						<th class="text-left py-2 px-4">Moonrocks</th>
					</tr>
				</thead>
				<tbody>
					{#each sortedGamePacks as gamePack}
						<tr class="border-b border-gray-200 hover:bg-gray-100 hover:text-black transition-colors">
							<td class="py-2 px-4">
								<a href="/gamepack/{gamePack.player_id}/{gamePack.gamepack_id}" class="block">
									{shortenPlayerId(gamePack.player_id)}
								</a>
							</td>
							<td class="py-2 px-4">
								<a href="/gamepack/{gamePack.player_id}/{gamePack.gamepack_id}" class="block">
									{gamePack.gamepack_id.toString()}
								</a>
							</td>
							<td class="py-2 px-4">
								<a href="/gamepack/{gamePack.player_id}/{gamePack.gamepack_id}" class="block">
									{getStateString(gamePack.state)}
								</a>
							</td>
							<td class="py-2 px-4">
								<a href="/gamepack/{gamePack.player_id}/{gamePack.gamepack_id}" class="block">
									{gamePack.data.current_game_id.toString()}
								</a>
							</td>
							<td class="py-2 px-4">
								<a href="/gamepack/{gamePack.player_id}/{gamePack.gamepack_id}" class="block">
									{gamePack.data.accumulated_moonrocks.toString()}
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
