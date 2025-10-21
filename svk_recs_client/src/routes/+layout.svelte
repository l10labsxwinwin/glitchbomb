<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { dojoStore } from '$lib/stores/dojo.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		dojoStore.initialize();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
