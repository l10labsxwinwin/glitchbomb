<script lang="ts">
	interface Props {
		consumedOrbs: any[];
	}

	let { consumedOrbs }: Props = $props();

	function getOrbInitials(orb: any): { initials: string; value: number } | null {
		if (!orb) return null;
		if (orb.Point != null) return { initials: 'P', value: orb.Point };
		if (orb.PointPerOrbRemaining != null) return { initials: 'PPO', value: orb.PointPerOrbRemaining };
		if (orb.PointPerBombPulled != null) return { initials: 'PPB', value: orb.PointPerBombPulled };
		if (orb.GlitchChips != null) return { initials: 'GC', value: orb.GlitchChips };
		if (orb.Moonrocks != null) return { initials: 'MR', value: orb.Moonrocks };
		if (orb.Health != null) return { initials: 'H', value: orb.Health };
		if (orb.Bomb != null) return { initials: 'B', value: orb.Bomb };
		if (orb.Multiplier != null) return { initials: 'X', value: orb.Multiplier };
		if (orb.BombImmunity != null) return { initials: 'BI', value: orb.BombImmunity };
		return null;
	}
</script>

<div>
	<h2 class="text-xl font-bold mb-4">Recent Pulls</h2>
	<div class="bg-black/30 border border-white/10 p-3 rounded-lg">
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
