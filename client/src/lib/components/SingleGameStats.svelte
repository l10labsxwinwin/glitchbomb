<script lang="ts">
	interface Props {
		game: any;
	}

	let { game }: Props = $props();

	const maxHp = 5;
	const hpPercentage = $derived((game.data.hp / maxHp) * 100);
	const pointsPercentage = $derived((game.data.points / game.data.milestone) * 100);
</script>

<div>
	<h2 class="text-2xl font-bold mb-4">State: {game.state} {game.data.level}</h2>
	<div class="bg-black/30 border border-white p-4 rounded-lg space-y-4">
		<div>
			<div class="flex justify-between mb-2">
				<span class="opacity-60 text-sm">HP</span>
				<span class="text-sm font-bold">{game.data.hp} / {maxHp}</span>
			</div>
			<div class="w-full bg-black/50 rounded-full h-6 border border-white/10">
				<div
					class="bg-red-600 h-full rounded-full transition-all duration-300"
					style="width: {Math.min(hpPercentage, 100)}%"
				></div>
			</div>
		</div>

		<div>
			<div class="flex justify-between mb-2">
				<span class="opacity-60 text-sm">Points / Milestone</span>
				<span class="text-sm font-bold">{game.data.points} / {game.data.milestone}</span>
			</div>
			<div class="w-full bg-black/50 rounded-full h-6 border border-white/10">
				<div
					class="bg-blue-600 h-full rounded-full transition-all duration-300"
					style="width: {Math.min(pointsPercentage, 100)}%"
				></div>
			</div>
		</div>

		<div class="grid grid-cols-4 gap-4 pt-2">
			<div class="text-center">
				<div class="text-xl font-bold mb-1">{game.data.multiplier}</div>
				<div class="opacity-60 text-sm">Multiplier</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold mb-1">{game.data.glitch_chips}</div>
				<div class="opacity-60 text-sm">Glitch Chips</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold mb-1">{game.data.pull_number}</div>
				<div class="opacity-60 text-sm">Pull Number</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold mb-1">{game.data.temp_moonrocks}</div>
				<div class="opacity-60 text-sm">Temp Moonrocks</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold mb-1">{game.data.moonrocks_spent}</div>
				<div class="opacity-60 text-sm">Moonrocks Spent</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold mb-1">{game.data.moonrocks_earned}</div>
				<div class="opacity-60 text-sm">Moonrocks Earned</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold mb-1">{game.data.bomb_immunity_turns}</div>
				<div class="opacity-60 text-sm">Bomb Immunity</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold mb-1">{game.data.bombs_pulled_in_level}</div>
				<div class="opacity-60 text-sm">Bombs Pulled</div>
			</div>
		</div>
	</div>
</div>
