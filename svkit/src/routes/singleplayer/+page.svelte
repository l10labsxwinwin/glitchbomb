<script lang="ts">
	import { onMount } from 'svelte';
	import { dojoConfig } from '$lib/dojoConfig';
	import { setup } from '$lib/dojo/setup';
	import type { BurnerManager } from '@dojoengine/create-burner';
	import type { Account } from 'starknet';

	let loading = $state(true);
	let error = $state('');
	let burnerManager: BurnerManager | undefined = $state();
	let account: Account | undefined = $state();
	let burnerAddress = $state('');
	let burnerCount = $state(0);
	let burners: any[] = $state([]);

	onMount(async () => {
		try {
			console.log('Initializing Dojo app...');
			const result = await setup(dojoConfig);
			burnerManager = result.burnerManager;
			account = result.account;
			burnerAddress = account.address;
			updateBurnerList();
			loading = false;
			console.log('✅ Burner wallet initialized');
			console.log('Active burner address:', account.address);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to initialize burner wallet';
			console.error('Failed to initialize:', e);
			loading = false;
		}
	});

	function updateBurnerList() {
		if (!burnerManager) return;
		burners = burnerManager.list();
		burnerCount = burners.length;
	}

	async function createBurner() {
		if (!burnerManager) return;
		console.log('Creating new burner...');
		await burnerManager.create();
		updateBurnerList();
		console.log('✅ New burner created');
	}

	function clearBurners() {
		if (!burnerManager) return;
		if (confirm('Are you sure you want to clear all burners?')) {
			burnerManager.clear();
			updateBurnerList();
			console.log('✅ All burners cleared');
		}
	}

	async function saveBurners() {
		if (!burnerManager) return;
		try {
			await burnerManager.copyBurnersToClipboard();
			alert('Burners saved to clipboard!');
		} catch (err) {
			console.error('Failed to save burners:', err);
		}
	}

	async function restoreBurners() {
		if (!burnerManager) return;
		try {
			await burnerManager.setBurnersFromClipboard();
			updateBurnerList();
			alert('Burners restored from clipboard!');
		} catch (err) {
			console.error('Failed to restore burners:', err);
		}
	}

	function selectBurner(event: Event) {
		if (!burnerManager) return;
		const target = event.target as HTMLSelectElement;
		burnerManager.select(target.value);
		account = burnerManager.getActiveAccount();
		if (account) {
			burnerAddress = account.address;
		}
		console.log('Switched to burner:', target.value);
	}
</script>

<div class="flex items-center justify-center min-h-screen p-8">
	<div class="w-full max-w-2xl">
		<div class="mb-8">
			<a href="/" class="text-sm opacity-60 hover:opacity-100">← BACK</a>
		</div>

		<h1 class="text-4xl font-bold mb-8">SINGLE PLAYER VIEW</h1>

		{#if loading}
			<div class="text-center py-8">
				<p class="text-lg">Loading burner wallet...</p>
			</div>
		{:else if error}
			<div class="text-center py-8 text-red-500">
				<p class="text-lg">Error: {error}</p>
			</div>
		{:else}
			<div class="space-y-6">
				<div class="bg-black/30 p-6 rounded-lg">
					<h2 class="text-xl font-bold mb-4">Burner Wallet</h2>
					<div class="space-y-2 mb-4">
						<p class="text-sm opacity-80">
							Active Burner: <code class="bg-black/50 px-2 py-1 rounded"
								>{burnerAddress}</code
							>
						</p>
						<p class="text-sm opacity-80">Total Burners: {burnerCount}</p>
					</div>

					<div class="space-y-3">
						<div class="flex flex-wrap gap-2">
							<button
								onclick={createBurner}
								class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
							>
								Create New Burner
							</button>
							<button
								onclick={clearBurners}
								class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
							>
								Clear All Burners
							</button>
							<button
								onclick={saveBurners}
								class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
							>
								Save to Clipboard
							</button>
							<button
								onclick={restoreBurners}
								class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
							>
								Restore from Clipboard
							</button>
						</div>

						<div>
							<label for="burner-select" class="block text-sm mb-1 opacity-80"
								>Select Burner:</label
							>
							<select
								id="burner-select"
								onchange={selectBurner}
								class="w-full px-3 py-2 bg-black/50 border border-white/20 rounded"
							>
								{#each burners as burner}
									<option value={burner.address} selected={burner.active}>
										{burner.address}
									</option>
								{/each}
							</select>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
