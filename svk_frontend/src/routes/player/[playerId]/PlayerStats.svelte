<script lang="ts">
	import type { Player } from '$lib/typescript/models.gen';

	let { player }: { player: Player } = $props();

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

<div class="border border-gray-300 p-6 rounded-lg">
	<div class="mb-6">
		<p class="text-gray-400 text-sm mb-1">Player ID</p>
		<p class="text-lg font-semibold">{player.player_id}</p>
	</div>
	<div class="grid grid-cols-3 gap-6">
		<div>
			<p class="text-gray-400 text-sm mb-1">State</p>
			<p class="text-lg font-semibold">{getStateString(player.state)}</p>
		</div>
		<div>
			<p class="text-gray-400 text-sm mb-1">USDC</p>
			<p class="text-lg font-semibold">{player.data.usdc.toString()}</p>
		</div>
		<div>
			<p class="text-gray-400 text-sm mb-1">GamePacks Bought</p>
			<p class="text-lg font-semibold">{player.data.gamepacks_bought.toString()}</p>
		</div>
	</div>
</div>
