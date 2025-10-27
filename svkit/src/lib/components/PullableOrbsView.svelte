<script lang="ts">
	interface Props {
		pullableOrbs: any[];
		onPullSpecific: (orbIndex: number) => Promise<void>;
		pullingSpecificOrbs: Map<number, boolean>;
	}

	let { pullableOrbs, onPullSpecific, pullingSpecificOrbs }: Props = $props();

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
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-xl font-bold">Pullable Orbs</h2>
		{#if totalPages > 1}
			<div class="flex items-center gap-2">
				<button
					onclick={prevPage}
					disabled={currentPage === 0}
					class="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded text-lg"
				>
					&lt;
				</button>
				<span class="text-sm opacity-60">{currentPage + 1}</span>
				<button
					onclick={nextPage}
					disabled={currentPage === totalPages - 1}
					class="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded text-lg"
				>
					&gt;
				</button>
			</div>
		{/if}
	</div>
	<div class="bg-black/30 border border-white/10 p-3 rounded-lg">
		<div class="grid grid-cols-3 gap-3">
			{#each currentOrbs() as orb, i}
				{@const effect = getOrbEffect(orb)}
				{@const orbIndex = currentPage * orbsPerPage + i}
				{@const isPulling = pullingSpecificOrbs.get(orbIndex) || false}
				{#if effect}
					<button
						onclick={() => onPullSpecific(orbIndex)}
						disabled={isPulling}
						class="aspect-square bg-black/50 hover:bg-black/70 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded border border-white/10 flex flex-col items-center justify-center transition-colors"
					>
						{#if isPulling}
							<div class="text-xs opacity-80">Pulling...</div>
						{:else}
							<div class="text-xl font-bold mb-1">{effect.value}</div>
							<div class="text-xs opacity-80">{effect.type}</div>
						{/if}
					</button>
				{:else}
					<div class="aspect-square bg-black/20 p-3 rounded border border-white/5 flex items-center justify-center">
						<div class="opacity-30 text-sm">Empty</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
