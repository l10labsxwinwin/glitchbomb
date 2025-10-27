<script lang="ts">
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
	}

	interface Game {
		player_id: string;
		gamepack_id: number;
		game_id: number;
		state: string;
		data: GameData;
	}

	interface Props {
		game: Game;
	}

	let { game }: Props = $props();
</script>

<div>
	<h2 class="text-2xl font-bold mb-4">State: {game.state}</h2>
	<div class="bg-black/30 border border-white/10 p-4 rounded-lg">
		<div class="grid grid-cols-4 gap-4">
			<div class="text-center">
				<div class="text-xl font-bold mb-1">{game.data.level}</div>
				<div class="opacity-60 text-sm">Level</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold mb-1">{game.data.hp}</div>
				<div class="opacity-60 text-sm">HP</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold mb-1">{game.data.points}</div>
				<div class="opacity-60 text-sm">Points</div>
			</div>
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
				<div class="text-xl font-bold mb-1">{game.data.milestone}</div>
				<div class="opacity-60 text-sm">Milestone</div>
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
