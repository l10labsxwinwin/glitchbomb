<script lang="ts">
	interface Props {
		onStartNextGame: () => Promise<void>;
		startingNextGame: boolean;
	}

	let { onStartNextGame, startingNextGame }: Props = $props();
</script>

<div>
	<h2 class="text-xl font-bold mb-4">Actions</h2>
	<div class="bg-black/30 border border-white/10 p-4 rounded-lg">
		<div class="flex gap-4 justify-center">
			<button
				onclick={onStartNextGame}
				disabled={startingNextGame}
				class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer rounded-lg font-bold"
			>
				{startingNextGame ? 'Starting...' : 'Start Next Game'}
			</button>
		</div>
	</div>
</div>
