<script lang="ts">
	import SingleGameStats from './SingleGameStats.svelte';
	import InLevelActions from './InLevelActions.svelte';
	import PullableOrbsView from './PullableOrbsView.svelte';

	interface Props {
		gamepack: any | null;
		game: any | null;
		orbs: any | null;
		loading: boolean;
		error: string | null;
		openGamepack: () => Promise<void>;
		startGame: () => Promise<void>;
		openingGamepack: boolean;
		startingGame: boolean;
		pullOrb: () => Promise<void>;
		cashOut: () => Promise<void>;
		enterShop: () => Promise<void>;
		pullingOrb: boolean;
		cashingOut: boolean;
		enteringShop: boolean;
	}

	let { gamepack, game, orbs, loading, error, openGamepack, startGame, openingGamepack, startingGame, pullOrb, cashOut, enterShop, pullingOrb, cashingOut, enteringShop }: Props = $props();
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
				<div class="space-y-6">
					<SingleGameStats {game} />
					<InLevelActions onPullOrb={pullOrb} onCashOut={cashOut} onEnterShop={enterShop} {pullingOrb} {cashingOut} {enteringShop} />
					<PullableOrbsView pullableOrbs={game.data.pullable_orbs} />
				</div>
			{:else}
				<p class="opacity-60">No data available</p>
			{/if}
		</div>
	</div>
</div>
