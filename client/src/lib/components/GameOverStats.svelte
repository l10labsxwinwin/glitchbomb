<script lang="ts">
	interface Props {
		gamepack: any;
		game: any;
	}

	let { gamepack, game }: Props = $props();
</script>

<div>
	<h2 class="text-3xl font-bold mb-6 text-center">Game Over</h2>
	<div class="space-y-6">
		<div class="bg-black/30 border border-white p-6 rounded-lg">
			<div class="text-center">
				<div class="text-5xl font-bold mb-2">{gamepack?.data?.accumulated_moonrocks ?? 0}</div>
				<div class="text-lg opacity-60">Total Moonrocks</div>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="bg-black/30 border border-white p-4 rounded-lg text-center">
				<div class="text-3xl font-bold mb-1">{game?.data?.moonrocks_earned ?? 0}</div>
				<div class="text-sm opacity-60">Earned</div>
			</div>
			<div class="bg-black/30 border border-white p-4 rounded-lg text-center">
				<div class="text-3xl font-bold mb-1">{game?.data?.moonrocks_spent ?? 0}</div>
				<div class="text-sm opacity-60">Spent</div>
			</div>
		</div>

		<div class="bg-black/30 border border-white p-4 rounded-lg">
			<div class="text-center">
				<div class="text-2xl font-bold mb-1">{game?.data?.level ?? 0}</div>
				<div class="text-sm opacity-60">Final Level</div>
			</div>
		</div>
	</div>
</div>
