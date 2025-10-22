<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Toast from '$lib/components/Toast.svelte';
	import { dojoConfig } from '$lib/dojoConfig';
	import { setup } from '$lib/dojo/setup';
	import {
		burnerManager as burnerManagerStore,
		account as accountStore,
		dojoProvider as dojoProviderStore
	} from '$lib/stores/burner';

	let { children } = $props();

	onMount(async () => {
		try {
			console.log('Initializing Dojo app...');
			const result = await setup(dojoConfig);
			burnerManagerStore.set(result.burnerManager);
			accountStore.set(result.account);
			dojoProviderStore.set(result.dojoProvider);
			console.log('✅ Burner wallet initialized');
			console.log('Active burner address:', result.account.address);
		} catch (e) {
			console.error('Failed to initialize burner wallet:', e);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
</svelte:head>

{@render children?.()}

<Toast />
