<script lang="ts">
	interface PlayerData {
		usdc: number;
		gamepacks_bought: number;
	}

	interface Player {
		player: string;
		state: string;
		data: PlayerData;
	}

	interface Props {
		player: Player | null;
	}

	let { player }: Props = $props();
</script>

<div class="bg-black/30 border-b border-white/10 px-4 py-3">
	<div class="max-w-7xl mx-auto">
		{#if player}
			<div class="flex items-center gap-6 flex-wrap text-sm">
				<div class="flex items-center gap-2">
					<span class="opacity-60">Player:</span>
					<code class="bg-black/50 px-2 py-1 rounded text-xs">
						{player.player.slice(0, 6)}...{player.player.slice(-4)}
					</code>
				</div>
				<div class="flex items-center gap-2">
					<span class="opacity-60">State:</span>
					<span class="bg-black/50 px-2 py-1 rounded">{player.state}</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="opacity-60">USDC:</span>
					<span class="bg-black/50 px-2 py-1 rounded font-bold">{player.data.usdc}</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="opacity-60">Gamepacks:</span>
					<span class="bg-black/50 px-2 py-1 rounded">{player.data.gamepacks_bought}</span>
				</div>
			</div>
		{:else}
			<div class="text-sm opacity-60">No player data available</div>
		{/if}
	</div>
</div>
