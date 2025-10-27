<script lang="ts">
	interface OrbEffect {
		Point?: number;
		PointPerOrbRemaining?: number;
		PointPerBombPulled?: number;
		GlitchChips?: number;
		Moonrocks?: number;
		Health?: number;
		Bomb?: number;
		Multiplier?: number;
		BombImmunity?: number;
		option?: any;
	}

	interface Orb {
		effect: OrbEffect;
		count: number;
		base_price: number;
		current_price: number;
	}

	interface OrbsInGame {
		player_id: string;
		gamepack_id: number;
		game_id: number;
		non_buyable: Orb[];
		common: Orb[];
		rare: Orb[];
		cosmic: Orb[];
	}

	interface Props {
		orb: OrbsInGame;
		onBuyOrb?: (orbId: number) => void;
		buyingOrbs?: Map<number, boolean>;
	}

	let { orb, onBuyOrb, buyingOrbs = new Map() }: Props = $props();

	function formatOrbEffect(orb: OrbEffect): string {
		for (const [key, value] of Object.entries(orb)) {
			if (key !== 'option' && value !== undefined && value !== null) {
				if (typeof value === 'number' && value !== 0) {
					return `${key}(${value})`;
				} else if (typeof value === 'object') {
					return key;
				}
			}
		}
		return '';
	}
</script>

<div class="bg-black/30 border border-white/10 p-4 rounded-lg">
	<h3 class="font-bold mb-4">Shop - Game #{orb?.game_id || 'N/A'}</h3>

	<div class="grid grid-cols-3 gap-4">
		<div>
			<div class="text-sm font-bold mb-2 opacity-60">Common ({orb?.common?.length || 0})</div>
			{#if orb?.common && orb.common.length > 0}
				<div class="space-y-1 text-sm">
					{#each orb.common as orbItem, index}
						<button
							onclick={() => onBuyOrb?.(index)}
							disabled={buyingOrbs.get(index)}
							class="w-full bg-black/50 hover:bg-green-600/30 px-2 py-1 rounded text-left disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
						>
							{#if buyingOrbs.get(index)}
								Buying...
							{:else}
								<div>{formatOrbEffect(orbItem.effect)}</div>
								<div class="text-xs opacity-60">Price: {orbItem.current_price} MR | Count: {orbItem.count} | Base: {orbItem.base_price}</div>
							{/if}
						</button>
					{/each}
				</div>
			{:else}
				<div class="text-xs opacity-60">No common orbs</div>
			{/if}
		</div>

		<div>
			<div class="text-sm font-bold mb-2 opacity-60">Rare ({orb?.rare?.length || 0})</div>
			{#if orb?.rare && orb.rare.length > 0}
				<div class="space-y-1 text-sm">
					{#each orb.rare as orbItem, index}
						{@const orbId = orb.common.length + index}
						<button
							onclick={() => onBuyOrb?.(orbId)}
							disabled={buyingOrbs.get(orbId)}
							class="w-full bg-black/50 hover:bg-blue-600/30 px-2 py-1 rounded text-left disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
						>
							{#if buyingOrbs.get(orbId)}
								Buying...
							{:else}
								<div>{formatOrbEffect(orbItem.effect)}</div>
								<div class="text-xs opacity-60">Price: {orbItem.current_price} MR | Count: {orbItem.count} | Base: {orbItem.base_price}</div>
							{/if}
						</button>
					{/each}
				</div>
			{:else}
				<div class="text-xs opacity-60">No rare orbs</div>
			{/if}
		</div>

		<div>
			<div class="text-sm font-bold mb-2 opacity-60">Cosmic ({orb?.cosmic?.length || 0})</div>
			{#if orb?.cosmic && orb.cosmic.length > 0}
				<div class="space-y-1 text-sm">
					{#each orb.cosmic as orbItem, index}
						{@const orbId = orb.common.length + orb.rare.length + index}
						<button
							onclick={() => onBuyOrb?.(orbId)}
							disabled={buyingOrbs.get(orbId)}
							class="w-full bg-black/50 hover:bg-purple-600/30 px-2 py-1 rounded text-left disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
						>
							{#if buyingOrbs.get(orbId)}
								Buying...
							{:else}
								<div>{formatOrbEffect(orbItem.effect)}</div>
								<div class="text-xs opacity-60">Price: {orbItem.current_price} MR | Count: {orbItem.count} | Base: {orbItem.base_price}</div>
							{/if}
						</button>
					{/each}
				</div>
			{:else}
				<div class="text-xs opacity-60">No cosmic orbs</div>
			{/if}
		</div>
	</div>
</div>
