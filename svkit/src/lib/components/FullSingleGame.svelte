<script lang="ts">
	import SingleGameStats from './SingleGameStats.svelte';

	interface GamePackData {
		current_game_id: number;
		accumulated_moonrocks: number;
	}

	interface GamePack {
		player_id: string;
		gamepack_id: number;
		state: string;
		data: GamePackData;
	}

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
		player_id: string;
		gamepack_id: number;
		game_id: number;
		state: string;
		data: GameData;
	}

	interface OrbsInGame {
		player_id: string;
		gamepack_id: number;
		game_id: number;
		non_buyable: any[];
		common: any[];
		rare: any[];
		cosmic: any[];
	}

	interface Props {
		gamepack: GamePack | null;
		game: Game | null;
		orbs: OrbsInGame | null;
		loading: boolean;
		error: string | null;
		openGamepack: () => Promise<void>;
		startGame: () => Promise<void>;
		openingGamepack: boolean;
		startingGame: boolean;
	}

	let { gamepack, game, orbs, loading, error, openGamepack, startGame, openingGamepack, startingGame }: Props = $props();
</script>

<div class="min-h-screen flex flex-col">
	<div class="bg-black/50 border-b border-white/10 px-4 py-3">
		<div class="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
			<div class="flex items-center gap-4">
				<a href="/singleplayer" class="text-sm opacity-60 hover:opacity-100">← BACK</a>
				<span class="text-sm font-bold">GAME</span>
			</div>
		</div>
	</div>

	<div class="flex-1 p-8">
		<div class="max-w-7xl mx-auto">
			{#if loading}
				<p>Loading...</p>
			{:else if error}
				<p class="text-red-500">Error: {error}</p>
			{:else if gamepack?.state === 'Unopened'}
				<div class="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
					<p class="text-xl opacity-60 mb-4">Gamepack is unopened</p>
					<button
						onclick={openGamepack}
						disabled={openingGamepack}
						class="px-12 py-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-2xl"
					>
						{openingGamepack ? 'Opening...' : 'Open Gamepack'}
					</button>
				</div>
			{:else if game?.state === 'New'}
				<div class="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
					<p class="text-xl opacity-60 mb-4">Game is ready to start</p>
					<button
						onclick={startGame}
						disabled={startingGame}
						class="px-12 py-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-2xl"
					>
						{startingGame ? 'Starting...' : 'Start Game'}
					</button>
				</div>
			{:else if game}
				<SingleGameStats {game} />
			{:else}
				<p class="opacity-60">No data available</p>
			{/if}
		</div>
	</div>
</div>
