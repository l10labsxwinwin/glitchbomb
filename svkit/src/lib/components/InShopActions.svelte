<script lang="ts">
	interface Props {
		onNextLevel: () => Promise<void>;
		nextingLevel: boolean;
	}

	let { onNextLevel, nextingLevel }: Props = $props();
</script>

<div>
	<h2 class="text-xl font-bold mb-4">Actions</h2>
	<div class="bg-black/30 border border-white/10 p-4 rounded-lg">
		<div class="flex gap-4 justify-center">
			<button
				onclick={onNextLevel}
				disabled={nextingLevel}
				class="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer rounded-lg font-bold"
			>
				{nextingLevel ? 'Loading...' : 'Next Level'}
			</button>
		</div>
	</div>
</div>
