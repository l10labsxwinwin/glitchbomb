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

	interface GameData {
		level: number;
		pull_number: number;
		points: number;
		milestone: number;
		hp: number;
		multiplier: number;
		glitch_chips: number;
		moonrocks_spent: number;
		moonrocks_earned: number;
		temp_moonrocks: number;
		bomb_immunity_turns: number;
		bombs_pulled_in_level: number;
		pullable_orbs: OrbEffect[];
		consumed_orbs: OrbEffect[];
	}

	interface Game {
		player: string;
		gamepack_id: number;
		game_id: number;
		state: string;
		data: GameData;
	}

	interface Props {
		game: Game;
		onStartGame?: (gameId: number) => void;
		onPullOrb?: (gameId: number) => void;
		onCashOut?: () => void;
		startingGames?: Map<number, boolean>;
		pullingOrbs?: Map<number, boolean>;
		cashingOut?: boolean;
	}

	let {
		game,
		onStartGame,
		onPullOrb,
		onCashOut,
		startingGames = new Map(),
		pullingOrbs = new Map(),
		cashingOut = false
	}: Props = $props();

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
	<!-- Header with Game ID and State -->
	<div class="flex items-center gap-4 mb-3">
		<h3 class="font-bold">Game #{game.game_id}</h3>
		<span class="text-sm"><span class="opacity-60">State:</span> {game.state}</span>
	</div>

	<!-- Stats Section (4 rows x 3 columns) -->
	<div class="mb-4">
		<div class="text-sm font-bold mb-2 opacity-60">Stats</div>
		<div class="space-y-1 text-sm">
			<!-- Row 1 -->
			<div class="grid grid-cols-3 gap-2">
				<div class="flex justify-between">
					<span class="opacity-60">Level:</span>
					<span>{game.data.level}</span>
				</div>
				<div class="flex justify-between">
					<span class="opacity-60">Pull #:</span>
					<span>{game.data.pull_number}</span>
				</div>
				<div class="flex justify-between">
					<span class="opacity-60">Milestone:</span>
					<span>{game.data.milestone}</span>
				</div>
			</div>
			<!-- Row 2 -->
			<div class="grid grid-cols-3 gap-2">
				<div class="flex justify-between">
					<span class="opacity-60">HP:</span>
					<span>{game.data.hp}</span>
				</div>
				<div class="flex justify-between">
					<span class="opacity-60">Multiplier:</span>
					<span>{game.data.multiplier}</span>
				</div>
				<div class="flex justify-between">
					<span class="opacity-60">Points:</span>
					<span>{game.data.points}</span>
				</div>
			</div>
			<!-- Row 3 - All MR stats -->
			<div class="grid grid-cols-3 gap-2">
				<div class="flex justify-between">
					<span class="opacity-60">MR Spent:</span>
					<span>{game.data.moonrocks_spent}</span>
				</div>
				<div class="flex justify-between">
					<span class="opacity-60">MR Earned:</span>
					<span>{game.data.moonrocks_earned}</span>
				</div>
				<div class="flex justify-between">
					<span class="opacity-60">Temp MR:</span>
					<span>{game.data.temp_moonrocks}</span>
				</div>
			</div>
			<!-- Row 4 -->
			<div class="grid grid-cols-3 gap-2">
				<div class="flex justify-between">
					<span class="opacity-60">Glitch Chips:</span>
					<span>{game.data.glitch_chips}</span>
				</div>
				<div class="flex justify-between">
					<span class="opacity-60">Bomb Immunity:</span>
					<span>{game.data.bomb_immunity_turns}</span>
				</div>
				<div class="flex justify-between">
					<span class="opacity-60">Bombs Pulled:</span>
					<span>{game.data.bombs_pulled_in_level}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Orbs Section (2 Columns) -->
	<div class="grid grid-cols-2 gap-4 mb-4">
		<!-- Pullable Orbs -->
		<div>
			<div class="text-sm font-bold mb-2 opacity-60">
				Pullable Orbs ({game.data.pullable_orbs.length})
			</div>
			{#if game.data.pullable_orbs.length > 0}
				<div class="space-y-1 text-sm">
					{#each game.data.pullable_orbs as orb}
						<div class="bg-black/50 px-2 py-1 rounded">{formatOrbEffect(orb)}</div>
					{/each}
				</div>
			{:else}
				<div class="text-xs opacity-60">No pullable orbs</div>
			{/if}
		</div>

		<!-- Consumed Orbs -->
		<div>
			<div class="text-sm font-bold mb-2 opacity-60">
				Consumed Orbs ({game.data.consumed_orbs.length})
			</div>
			{#if game.data.consumed_orbs.length > 0}
				<div class="space-y-1 text-sm">
					{#each game.data.consumed_orbs as orb}
						<div class="bg-black/50 px-2 py-1 rounded">{formatOrbEffect(orb)}</div>
					{/each}
				</div>
			{:else}
				<div class="text-xs opacity-60">No consumed orbs</div>
			{/if}
		</div>
	</div>

	<!-- Action Buttons -->
	<div class="flex gap-2">
		{#if onStartGame}
			<button
				onclick={() => onStartGame?.(game.game_id)}
				disabled={startingGames.get(game.game_id) || game.state !== 'New'}
				class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-bold text-sm"
			>
				{startingGames.get(game.game_id) ? 'Starting...' : 'Start Game'}
			</button>
		{/if}
		{#if onPullOrb}
			<button
				onclick={() => onPullOrb?.(game.game_id)}
				disabled={pullingOrbs.get(game.game_id) || game.data.hp === 0}
				class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-bold text-sm"
			>
				{pullingOrbs.get(game.game_id) ? 'Pulling...' : 'Pull Orb'}
			</button>
		{/if}
		{#if onCashOut}
			<button
				onclick={onCashOut}
				disabled={cashingOut || game.data.points === 0}
				class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-bold text-sm"
			>
				{cashingOut ? 'Cashing Out...' : 'Cash Out'}
			</button>
		{/if}
	</div>
</div>
