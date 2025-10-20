<script lang="ts">
	import { getToriiState } from './torii_global.svelte';
	import type { GamePack } from './typescript/models.gen';

	let { playerId }: { playerId: string } = $props();

	const state = getToriiState();

	const playerGamePacks = $derived(
		[...state.gamePacks]
			.filter((pack) => pack.player_id === playerId)
			.sort((a, b) => Number(b.gamepack_id) - Number(a.gamepack_id))
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

<div>
	{#if playerGamePacks.length === 0}
		<p>No game packs available for this player</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead>
					<tr class="border-b border-gray-300">
						<th class="text-left py-2 px-4">GamePack ID</th>
						<th class="text-left py-2 px-4">State</th>
						<th class="text-left py-2 px-4">Current Game ID</th>
						<th class="text-left py-2 px-4">Moonrocks</th>
					</tr>
				</thead>
				<tbody>
					{#each playerGamePacks as gamePack}
						<tr class="border-b border-gray-200 hover:bg-gray-100 hover:text-black transition-colors">
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
