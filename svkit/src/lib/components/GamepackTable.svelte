<script lang="ts">
	import GamepackCard from './GamepackCard.svelte';

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
		gamepacks: GamePack[];
	}

	let { gamepacks }: Props = $props();
</script>

<div>
	<h2 class="text-2xl font-bold mb-4">Gamepacks ({gamepacks.length})</h2>
	{#if gamepacks.length > 0}
		<div class="space-y-2">
			<div class="grid grid-cols-4 gap-2 sm:gap-4 px-3 py-2 text-xs sm:text-sm opacity-60 font-bold">
				<div>ID</div>
				<div class="text-center">State</div>
				<div class="text-center">Current Game</div>
				<div class="text-center">Moonrocks</div>
			</div>
			{#each gamepacks as gamepack}
				<GamepackCard {gamepack} />
			{/each}
		</div>
	{:else}
		<p class="text-sm opacity-60">No gamepacks found. Buy one to get started!</p>
	{/if}
</div>
