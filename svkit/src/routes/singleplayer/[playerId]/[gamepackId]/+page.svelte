<script lang="ts">
	import { page } from '$app/stores';

	const playerId = $derived($page.params.playerId);
	const gamepackId = $derived($page.params.gamepackId);
</script>

<div class="min-h-screen p-8">
	<div class="max-w-7xl mx-auto">
		<a href="/singleplayer" class="text-sm opacity-60 hover:opacity-100 mb-4 inline-block">
			← Back to Gamepacks
		</a>
		<h1 class="text-3xl font-bold mb-4">Gamepack {gamepackId}</h1>
		<p class="text-sm opacity-60">Player: {playerId}</p>
	</div>
</div>
