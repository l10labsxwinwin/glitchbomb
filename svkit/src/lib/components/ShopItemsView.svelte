<script lang="ts">
	interface Props {
		orbsInBag: any | null;
	}

	let { orbsInBag }: Props = $props();

	let currentPage = $state(0);
	const orbsPerPage = 9;

	function getOrbEffect(orb: any | null): { type: string; value: number | string } | null {
		if (!orb || !orb.effect || !orb.effect.option) return null;
		const effect = orb.effect;
		const option = effect.option;
		
		switch (option) {
			case 'Empty':
				return { type: 'Empty', value: '-' };
			case 'PointRewind':
				return { type: 'Pt Rewind', value: '-' };
			case 'FiveOrDie':
				return { type: '5 or Die', value: '-' };
			case 'Point':
				return { type: 'Points', value: effect.Point ?? 0 };
			case 'PointPerOrbRemaining':
				return { type: 'Pts/Orb', value: effect.PointPerOrbRemaining ?? 0 };
			case 'PointPerBombPulled':
				return { type: 'Pts/Bomb', value: effect.PointPerBombPulled ?? 0 };
			case 'GlitchChips':
				return { type: 'Chips', value: effect.GlitchChips ?? 0 };
			case 'Moonrocks':
				return { type: 'Moonrocks', value: effect.Moonrocks ?? 0 };
			case 'Health':
				return { type: 'Health', value: effect.Health ?? 0 };
			case 'Bomb':
				return { type: 'Bomb', value: effect.Bomb ?? 0 };
			case 'Multiplier':
				return { type: 'Multiplier', value: effect.Multiplier ?? 0 };
			case 'BombImmunity':
				return { type: 'Immunity', value: effect.BombImmunity ?? 0 };
			default:
				return null;
		}
	}

	const allOrbs = $derived(() => {
		if (!orbsInBag) return [];
		return [
			...(orbsInBag.common || []),
			...(orbsInBag.rare || []),
			...(orbsInBag.cosmic || [])
		]
		.filter(orb => getOrbEffect(orb) !== null)
		.sort((a, b) => a.current_price - b.current_price);
	});

	const totalPages = $derived(Math.max(1, Math.ceil(allOrbs().length / orbsPerPage)));

	const currentOrbs = $derived(() => {
		const start = currentPage * orbsPerPage;
		const end = start + orbsPerPage;
		const pageOrbs = allOrbs().slice(start, end);
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
</script>

<div>
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-xl font-bold">Shop Items</h2>
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
			{#each currentOrbs() as orb}
				{@const effect = getOrbEffect(orb)}
				{#if effect}
					<div class="aspect-square bg-black/50 p-3 rounded border border-white/10 flex flex-col items-center justify-center">
						<div class="text-xl font-bold mb-1">{effect.value}</div>
						<div class="text-xs opacity-80 mb-2">{effect.type}</div>
						<div class="text-xs opacity-60">Price: {orb.current_price}</div>
						<div class="text-xs opacity-60">Count: {orb.count}</div>
					</div>
				{:else}
					<div class="aspect-square bg-black/20 p-3 rounded border border-white/5 flex items-center justify-center">
						<div class="opacity-30 text-sm">Empty</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
