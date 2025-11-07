<script lang="ts">
	interface Props {
		consumedOrbs: any[];
	}

	let { consumedOrbs }: Props = $props();

	function getOrbInitials(orb: any): { initials: string; value: number | string } | null {
		if (!orb || !orb.option) return null;
		const option = orb.option;
		
		switch (option) {
			case 'Empty':
				return { initials: 'E', value: '-' };
			case 'PointRewind':
				return { initials: 'PR', value: '-' };
			case 'Point':
				return { initials: 'P', value: orb.Point ?? 0 };
			case 'PointPerOrbRemaining':
				return { initials: 'PPO', value: orb.PointPerOrbRemaining ?? 0 };
			case 'PointPerBombPulled':
				return { initials: 'PPB', value: orb.PointPerBombPulled ?? 0 };
			case 'GlitchChips':
				return { initials: 'GC', value: orb.GlitchChips ?? 0 };
			case 'Moonrocks':
				return { initials: 'MR', value: orb.Moonrocks ?? 0 };
			case 'Health':
				return { initials: 'H', value: orb.Health ?? 0 };
			case 'Bomb':
				return { initials: 'B', value: orb.Bomb ?? 0 };
			case 'Multiplier':
				return { initials: 'X', value: orb.Multiplier ?? 0 };
			case 'BombImmunity':
				return { initials: 'BI', value: orb.BombImmunity ?? 0 };
			default:
				return null;
		}
	}
</script>

<div>
	<h2 class="text-xl font-bold mb-4">Recent Pulls</h2>
	<div class="bg-black/30 border border-white p-3 rounded-lg">
		{#if consumedOrbs.length > 0}
			<div class="flex gap-2 overflow-x-auto">
				{#each [...consumedOrbs].reverse() as orb}
					{@const orbData = getOrbInitials(orb)}
					{#if orbData}
						<div class="flex-shrink-0 bg-black/50 px-3 py-2 rounded border border-white/10 text-center">
							<div class="text-sm font-bold">{orbData.initials}{orbData.value}</div>
						</div>
					{/if}
				{/each}
			</div>
		{:else}
			<div class="text-sm opacity-60 text-center">No orbs pulled yet</div>
		{/if}
	</div>
</div>
