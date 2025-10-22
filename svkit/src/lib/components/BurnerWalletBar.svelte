<script lang="ts">
	import type { BurnerManager } from '@dojoengine/create-burner';
	import {
		updateBurnerList as updateBurnerListHelper,
		createBurner as createBurnerHelper,
		clearBurners as clearBurnersHelper,
		saveBurners as saveBurnersHelper,
		restoreBurners as restoreBurnersHelper
	} from '$lib/../routes/singleplayer/burner_helpers';
	import {
		burnerManager as burnerManagerStore,
		account as accountStore
	} from '$lib/stores/burner';

	let burnerManager = $state<BurnerManager | undefined>(undefined);
	let burnerCount = $state(0);
	let burners: any[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	$effect(() => {
		burnerManager = $burnerManagerStore;
		if (burnerManager) {
			updateBurnerList();
			loading = false;
		}
	});

	function updateBurnerList() {
		const result = updateBurnerListHelper(burnerManager);
		burners = result.burners;
		burnerCount = result.count;
	}

	async function createBurner() {
		await createBurnerHelper(burnerManager);
		updateBurnerList();
	}

	function clearBurners() {
		clearBurnersHelper(burnerManager);
		updateBurnerList();
	}

	async function saveBurners() {
		await saveBurnersHelper(burnerManager);
	}

	async function restoreBurners() {
		await restoreBurnersHelper(burnerManager);
		updateBurnerList();
	}

	async function selectBurner(event: Event) {
		if (!burnerManager) return;
		const target = event.target as HTMLSelectElement;
		burnerManager.select(target.value);
		const selectedAccount = burnerManager.getActiveAccount();
		if (selectedAccount) {
			accountStore.set(selectedAccount);
		}
		console.log('Switched to burner:', target.value);
	}
</script>

{#if loading}
	<div class="text-sm opacity-60">Loading wallet...</div>
{:else if error}
	<div class="text-sm text-red-500">{error}</div>
{:else}
	<div class="flex items-center gap-3 flex-wrap">
		<select
			id="burner-select"
			onchange={selectBurner}
			class="px-3 py-1.5 text-sm bg-black/50 border border-white/20 rounded"
		>
			{#each burners as burner}
				<option value={burner.address} selected={burner.active}>
					{burner.address.slice(0, 6)}...{burner.address.slice(-4)}
				</option>
			{/each}
		</select>

		<div class="flex gap-2">
			<button
				onclick={createBurner}
				class="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded"
				title="Create New Burner"
			>
				+ New
			</button>
			<button
				onclick={saveBurners}
				class="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 rounded"
				title="Save to Clipboard"
			>
				Save
			</button>
			<button
				onclick={restoreBurners}
				class="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 rounded"
				title="Restore from Clipboard"
			>
				Restore
			</button>
			<button
				onclick={clearBurners}
				class="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 rounded"
				title="Clear All Burners"
			>
				Clear
			</button>
		</div>

		<div class="text-xs opacity-60">{burnerCount} burner{burnerCount !== 1 ? 's' : ''}</div>
	</div>
{/if}
