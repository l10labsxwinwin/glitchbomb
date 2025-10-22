<script>
	import { onDestroy, onMount } from 'svelte';
	import {
		init_sdk,
		subscribe_to_players,
		cleanup_players_subscription
	} from '$lib/dojo/setup.svelte';

	onMount(async () => {
		await init_sdk();
		await subscribe_to_players();
	});

	onDestroy(() => {
		cleanup_players_subscription();
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
