<script lang="ts">
	import type { GamePack } from '$lib/typescript/models.gen';
	import { getStateString } from '$lib/dojo_state_helpers';

	let { gamePack }: { gamePack: GamePack } = $props();
</script>

<div class="border border-gray-300 rounded-lg p-3 w-40 shadow-sm hover:shadow-md transition-shadow">
	<div class="text-center mb-3 pb-2 border-b border-gray-200">
		<p class="text-xs text-gray-400">GamePack</p>
		<p class="text-2xl font-bold">{gamePack.gamepack_id.toString()}</p>
	</div>
	<div class="space-y-2">
		<div>
			<p class="text-xs text-gray-400">State</p>
			<p class="text-sm font-semibold">{getStateString(gamePack.state)}</p>
		</div>
		<div>
			<p class="text-xs text-gray-400">Game ID</p>
			<p class="text-sm font-semibold">{gamePack.data.current_game_id.toString()}</p>
		</div>
		<div>
			<p class="text-xs text-gray-400">Moonrocks</p>
			<p class="text-sm font-semibold">{gamePack.data.accumulated_moonrocks.toString()}</p>
		</div>
	</div>
</div>
