<script lang="ts">
	import type { Player } from '$lib/dojo/typescript/models.gen';

	type Props = {
		player: Player;
	};

	let { player }: Props = $props();
</script>

<div class="rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition-all hover:border-zinc-700 hover:shadow-[0_4px_12px_rgba(255,255,255,0.1)]">
	<div class="mb-4 flex items-center justify-between gap-2">
		<h3 class="m-0 overflow-hidden text-ellipsis text-sm font-bold text-white">
			{player.player_id.slice(0, 10)}...{player.player_id.slice(-8)}
		</h3>
		<span class="rounded bg-green-500 px-3 py-1 text-xs font-bold uppercase text-black">
			Stacked
		</span>
	</div>
	<div class="grid grid-cols-2 gap-4">
		<div class="flex flex-col gap-1">
			<span class="text-xs uppercase text-zinc-500">USDC</span>
			<span class="text-xl font-bold text-white">{player.data.usdc.toString()}</span>
		</div>
		<div class="flex flex-col gap-1">
			<span class="text-xs uppercase text-zinc-500">Gamepacks</span>
			<span class="text-xl font-bold text-white">{player.data.gamepacks_bought.toString()}</span>
		</div>
	</div>
</div>
