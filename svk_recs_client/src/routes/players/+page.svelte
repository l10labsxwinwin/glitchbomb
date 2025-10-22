<script>
	import { get_dojo_state } from '$lib/dojo/setup.svelte';

	const dojoState = $derived(get_dojo_state());
</script>

<div>
	<h1>Players</h1>
	{#each dojoState.players as player (player.player_id)}
		{player.player_id}
	{/each}
</div>
