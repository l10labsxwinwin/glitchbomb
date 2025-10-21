<script>
	import { init_sdk } from '$lib/dojo/setup.svelte';

	$effect(() => {
		init_sdk();
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
