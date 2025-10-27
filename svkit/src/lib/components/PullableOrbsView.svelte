<script lang="ts">
	interface Props {
		pullableOrbs: any[];
	}

	let { pullableOrbs }: Props = $props();

	let currentPage = $state(0);
	const orbsPerPage = 9;

	const totalPages = $derived(Math.max(1, Math.ceil(pullableOrbs.length / orbsPerPage)));

	const currentOrbs = $derived(() => {
		const start = currentPage * orbsPerPage;
		const end = start + orbsPerPage;
		const pageOrbs = pullableOrbs.slice(start, end);
		const placeholders = Array(orbsPerPage - pageOrbs.length).fill(null);
		return [...pageOrbs, ...placeholders];
	});

	function nextPage() {
		if (currentPage < totalPages - 1) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}

	function getOrbEffect(orb: any | null): { type: string; value: number } | null {
		if (!orb) return null;
		if (orb.Point != null) return { type: 'Points', value: orb.Point };
		if (orb.PointPerOrbRemaining != null) return { type: 'Pts/Orb', value: orb.PointPerOrbRemaining };
		if (orb.PointPerBombPulled != null) return { type: 'Pts/Bomb', value: orb.PointPerBombPulled };
		if (orb.GlitchChips != null) return { type: 'Chips', value: orb.GlitchChips };
		if (orb.Moonrocks != null) return { type: 'Moonrocks', value: orb.Moonrocks };
		if (orb.Health != null) return { type: 'Health', value: orb.Health };
		if (orb.Bomb != null) return { type: 'Bomb', value: orb.Bomb };
		if (orb.Multiplier != null) return { type: 'Multiplier', value: orb.Multiplier };
		if (orb.BombImmunity != null) return { type: 'Immunity', value: orb.BombImmunity };
		return null;
	}
</script>

<div>
	<h2 class="text-xl font-bold mb-4">Pullable Orbs</h2>
	<div class="flex items-center gap-2">
		{#if totalPages > 1}
			<button
				onclick={prevPage}
				disabled={currentPage === 0}
				class="flex-shrink-0 px-2 py-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xl"
			>
				&lt;
			</button>
		{/if}
		<div class="flex-1 bg-black/30 border border-white/10 p-3 rounded-lg">
			<div class="grid grid-cols-3 gap-3">
				{#each currentOrbs() as orb, i}
					{@const effect = getOrbEffect(orb)}
					{#if effect}
						<div class="aspect-square bg-black/50 p-3 rounded border border-white/10 flex flex-col items-center justify-center">
							<div class="text-xl font-bold mb-1">{effect.value}</div>
							<div class="text-xs opacity-80">{effect.type}</div>
						</div>
					{:else}
						<div class="aspect-square bg-black/20 p-3 rounded border border-white/5 flex items-center justify-center">
							<div class="opacity-30 text-sm">Empty</div>
						</div>
					{/if}
				{/each}
			</div>
			{#if totalPages > 1}
				<div class="text-center mt-3 text-xs opacity-60">
					Page {currentPage + 1} of {totalPages}
				</div>
			{/if}
		</div>
		{#if totalPages > 1}
			<button
				onclick={nextPage}
				disabled={currentPage === totalPages - 1}
				class="flex-shrink-0 px-2 py-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xl"
			>
				&gt;
			</button>
		{/if}
	</div>
</div>
