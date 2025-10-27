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
	href="/singleplayer/{gamepack.player_id}/gamepack/{gamepack.gamepack_id}/game/{gamepack.data.current_game_id}"
	class="grid grid-cols-4 gap-2 sm:gap-4 items-center bg-black/30 border border-white/10 px-3 py-2 rounded hover:border-white/30 transition-colors text-sm"
>
	<div class="font-bold">#{gamepack.gamepack_id}</div>
	<div class="text-center">
		<span class="bg-black/50 px-2 py-1 rounded text-xs">{gamepack.state}</span>
	</div>
	<div class="text-center font-mono">{gamepack.data.current_game_id}</div>
	<div class="text-center font-mono">{gamepack.data.accumulated_moonrocks}</div>
</a>
