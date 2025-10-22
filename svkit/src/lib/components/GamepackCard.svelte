<script lang="ts">
	interface GamePackData {
		current_game_id: number;
		accumulated_moonrocks: number;
	}

	interface GamePack {
		player_id: string;
		gamepack_id: number;
		state: string;
		data: GamePackData;
	}

	interface Props {
		gamepack: GamePack;
	}

	let { gamepack }: Props = $props();
</script>

<a
	href="/singleplayer/{gamepack.player_id}/gamepack/{gamepack.gamepack_id}"
	class="block bg-black/30 border border-white/10 p-4 rounded-lg hover:border-white/30 transition-colors"
>
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-bold">Gamepack #{gamepack.gamepack_id}</h3>
			<span class="bg-black/50 px-3 py-1 rounded text-sm">{gamepack.state}</span>
		</div>

		<div class="grid grid-cols-2 gap-3 text-sm">
			<div>
				<div class="opacity-60 text-xs mb-1">Current Game ID</div>
				<div class="bg-black/50 px-3 py-2 rounded font-mono">
					{gamepack.data.current_game_id}
				</div>
			</div>
			<div>
				<div class="opacity-60 text-xs mb-1">Accumulated Moonrocks</div>
				<div class="bg-black/50 px-3 py-2 rounded font-mono">
					{gamepack.data.accumulated_moonrocks}
				</div>
			</div>
		</div>
	</div>
</a>
