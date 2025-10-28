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

	function getOrbEffect(orb: any | null): { type: string; value: number | string } | null {
		if (!orb || !orb.option) return null;
		const option = orb.option;
		
		switch (option) {
			case 'Empty':
				return { type: 'Empty', value: '-' };
			case 'PointRewind':
				return { type: 'Pt Rewind', value: '-' };
			case 'FiveOrDie':
				return { type: '5 or Die', value: '-' };
			case 'Point':
				return { type: 'Points', value: orb.Point ?? 0 };
			case 'PointPerOrbRemaining':
				return { type: 'Pts/Orb', value: orb.PointPerOrbRemaining ?? 0 };
			case 'PointPerBombPulled':
				return { type: 'Pts/Bomb', value: orb.PointPerBombPulled ?? 0 };
			case 'GlitchChips':
				return { type: 'Chips', value: orb.GlitchChips ?? 0 };
			case 'Moonrocks':
				return { type: 'Moonrocks', value: orb.Moonrocks ?? 0 };
			case 'Health':
				return { type: 'Health', value: orb.Health ?? 0 };
			case 'Bomb':
				return { type: 'Bomb', value: orb.Bomb ?? 0 };
			case 'Multiplier':
				return { type: 'Multiplier', value: orb.Multiplier ?? 0 };
			case 'BombImmunity':
				return { type: 'Immunity', value: orb.BombImmunity ?? 0 };
			default:
				return null;
		}
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
	<div class="bg-black/30 border border-white/10 p-3 rounded-lg flex items-center justify-center">
		<div class="grid grid-cols-3 gap-3 w-fit">
			{#each currentOrbs() as orb, i}
				{@const effect = getOrbEffect(orb)}
				{@const orbIndex = currentPage * orbsPerPage + i}
				{@const isPulling = pullingSpecificOrbs.get(orbIndex) || false}
				{#if effect}
					<button
						onclick={() => onPullSpecific(orbIndex)}
						disabled={isPulling}
						class="aspect-square w-[100px] bg-black/50 hover:bg-black/70 disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer p-3 rounded border border-white/10 flex flex-col items-center justify-center transition-colors"
					>
						{#if isPulling}
							<div class="text-xs opacity-80">Pulling...</div>
						{:else}
							<div class="text-xl font-bold mb-1">{effect.value}</div>
							<div class="text-xs opacity-80">{effect.type}</div>
						{/if}
					</button>
				{:else}
					<div class="aspect-square w-[100px] bg-black/20 p-3 rounded border border-white/5 flex items-center justify-center">
						<div class="opacity-30 text-sm">Empty</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
