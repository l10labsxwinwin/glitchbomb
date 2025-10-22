<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
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

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
