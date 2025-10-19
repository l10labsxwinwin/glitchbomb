<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initDojoSDK } from '$lib/torii_global.svelte';

	let { children } = $props();

	onMount(async () => {
		await initDojoSDK();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
