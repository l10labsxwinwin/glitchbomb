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
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each gamepacks as gamepack}
				<GamepackCard {gamepack} />
			{/each}
		</div>
	{:else}
		<p class="text-sm opacity-60">No gamepacks found. Buy one to get started!</p>
	{/if}
</div>
