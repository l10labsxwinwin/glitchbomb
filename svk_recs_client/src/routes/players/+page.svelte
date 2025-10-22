<script>
	import { get_dojo_state } from '$lib/dojo/setup.svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';

	const dojoState = $derived(get_dojo_state());
</script>

<div class="container">
	<h1 class="title">Players</h1>
	<div class="grid">
		{#each dojoState.players as player (player.player_id)}
			<PlayerCard {player} />
		{/each}
	</div>
</div>

<style>
	.container {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.title {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 2rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}
</style>
