<script lang="ts">
	import { getToriiState } from './torii_global.svelte';

	const state = getToriiState();

	const sortedPlayers = $derived(
		[...state.players].sort((a, b) => a.player_id.localeCompare(b.player_id))
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
	{#if sortedPlayers.length === 0}
		<p>No players available</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead>
					<tr class="border-b border-gray-300">
						<th class="text-left py-2 px-4">Player ID</th>
						<th class="text-left py-2 px-4">State</th>
						<th class="text-left py-2 px-4">USDC</th>
						<th class="text-left py-2 px-4">GamePacks Bought</th>
					</tr>
				</thead>
				<tbody>
					{#each sortedPlayers as player}
						<tr class="border-b border-gray-200 hover:bg-gray-100 hover:text-black transition-colors">
							<td class="py-2 px-4">
								<a href="/player/{player.player_id}" class="block">
									{shortenPlayerId(player.player_id)}
								</a>
							</td>
							<td class="py-2 px-4">
								<a href="/player/{player.player_id}" class="block">
									{getStateString(player.state)}
								</a>
							</td>
							<td class="py-2 px-4">
								<a href="/player/{player.player_id}" class="block">
									{player.data.usdc.toString()}
								</a>
							</td>
							<td class="py-2 px-4">
								<a href="/player/{player.player_id}" class="block">
									{player.data.gamepacks_bought.toString()}
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
