<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initDojoSDK, subscribeToGamePacks, subscribeToPlayers } from '$lib/torii_global.svelte';

	let { children } = $props();

	onMount(async () => {
		await initDojoSDK();
		await subscribeToGamePacks();
		await subscribeToPlayers();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
