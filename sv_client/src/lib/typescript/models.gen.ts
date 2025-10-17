import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, BigNumberish } from 'starknet';

// Type definition for `dojo_starter::glitchbombv2::game::Game` struct
export interface Game {
	player_id: string;
	gamepack_id: BigNumberish;
	game_id: BigNumberish;
	state: GameStateEnum;
	data: GameData;
}

// Type definition for `dojo_starter::glitchbombv2::game::GameData` struct
export interface GameData {
	level: BigNumberish;
	pull_number: BigNumberish;
	points: BigNumberish;
	milestone: BigNumberish;
	hp: BigNumberish;
	multiplier: BigNumberish;
	glitch_chips: BigNumberish;
	moonrocks_spent: BigNumberish;
	moonrocks_earned: BigNumberish;
	temp_moonrocks: BigNumberish;
	bomb_immunity_turns: BigNumberish;
	bombs_pulled_in_level: BigNumberish;
	pullable_orbs: Array<OrbEffectEnum>;
	consumed_orbs: Array<OrbEffectEnum>;
}

// Type definition for `dojo_starter::glitchbombv2::game::Orb` struct
export interface Orb {
	effect: OrbEffectEnum;
	count: BigNumberish;
	base_price: BigNumberish;
	current_price: BigNumberish;
}

// Type definition for `dojo_starter::glitchbombv2::game::OrbsInGame` struct
export interface OrbsInGame {
	player_id: string;
	gamepack_id: BigNumberish;
	game_id: BigNumberish;
	non_buyable: Array<Orb>;
	common: Array<Orb>;
	rare: Array<Orb>;
	cosmic: Array<Orb>;
}

// Type definition for `dojo_starter::glitchbombv2::gamepack::GamePack` struct
export interface GamePack {
	player_id: string;
	gamepack_id: BigNumberish;
	state: GamePackStateEnum;
	data: GamePackData;
}

// Type definition for `dojo_starter::glitchbombv2::gamepack::GamePackData` struct
export interface GamePackData {
	current_game_id: BigNumberish;
	accumulated_moonrocks: BigNumberish;
}

// Type definition for `dojo_starter::glitchbombv2::player::Player` struct
export interface Player {
	player_id: string;
	state: PlayerStateEnum;
	data: PlayerData;
}

// Type definition for `dojo_starter::glitchbombv2::player::PlayerData` struct
export interface PlayerData {
	usdc: BigNumberish;
	gamepacks_bought: BigNumberish;
}

// Type definition for `dojo_starter::glitchbombv2::game::GameState` enum
export const gameState = [
	'Empty',
	'New',
	'Level',
	'LevelComplete',
	'FiveOrDiePhase',
	'Shop',
	'GameOver',
] as const;
export type GameState = { [key in typeof gameState[number]]: string };
export type GameStateEnum = CairoCustomEnum;

// Type definition for `dojo_starter::glitchbombv2::game::OrbEffect` enum
export const orbEffect = [
	'Empty',
	'PointRewind',
	'FiveOrDie',
	'Point',
	'PointPerOrbRemaining',
	'PointPerBombPulled',
	'GlitchChips',
	'Moonrocks',
	'Health',
	'Bomb',
	'Multiplier',
	'BombImmunity',
] as const;
export type OrbEffect = { [key in typeof orbEffect[number]]: string };
export type OrbEffectEnum = CairoCustomEnum;

// Type definition for `dojo_starter::glitchbombv2::gamepack::GamePackState` enum
export const gamePackState = [
	'Empty',
	'Unopened',
	'InProgress',
	'EndedEarly',
	'Completed',
] as const;
export type GamePackState = { [key in typeof gamePackState[number]]: string };
export type GamePackStateEnum = CairoCustomEnum;

// Type definition for `dojo_starter::glitchbombv2::player::PlayerState` enum
export const playerState = [
	'Broke',
	'Stacked',
] as const;
export type PlayerState = { [key in typeof playerState[number]]: string };
export type PlayerStateEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	dojo_starter: {
		Game: Game,
		GameData: GameData,
		Orb: Orb,
		OrbsInGame: OrbsInGame,
		GamePack: GamePack,
		GamePackData: GamePackData,
		Player: Player,
		PlayerData: PlayerData,
	},
}
export const schema: SchemaType = {
	dojo_starter: {
		Game: {
			player_id: "",
			gamepack_id: 0,
			game_id: 0,
		state: new CairoCustomEnum({ 
					Empty: "",
				New: undefined,
				Level: undefined,
				LevelComplete: undefined,
				FiveOrDiePhase: undefined,
				Shop: undefined,
				GameOver: undefined, }),
		data: { level: 0, pull_number: 0, points: 0, milestone: 0, hp: 0, multiplier: 0, glitch_chips: 0, moonrocks_spent: 0, moonrocks_earned: 0, temp_moonrocks: 0, bomb_immunity_turns: 0, bombs_pulled_in_level: 0, pullable_orbs: [new CairoCustomEnum({ 
					Empty: "",
				PointRewind: undefined,
				FiveOrDie: undefined,
				Point: undefined,
				PointPerOrbRemaining: undefined,
				PointPerBombPulled: undefined,
				GlitchChips: undefined,
				Moonrocks: undefined,
				Health: undefined,
				Bomb: undefined,
				Multiplier: undefined,
				BombImmunity: undefined, })], consumed_orbs: [new CairoCustomEnum({ 
					Empty: "",
				PointRewind: undefined,
				FiveOrDie: undefined,
				Point: undefined,
				PointPerOrbRemaining: undefined,
				PointPerBombPulled: undefined,
				GlitchChips: undefined,
				Moonrocks: undefined,
				Health: undefined,
				Bomb: undefined,
				Multiplier: undefined,
				BombImmunity: undefined, })], },
		},
		GameData: {
			level: 0,
			pull_number: 0,
			points: 0,
			milestone: 0,
			hp: 0,
			multiplier: 0,
			glitch_chips: 0,
			moonrocks_spent: 0,
			moonrocks_earned: 0,
			temp_moonrocks: 0,
			bomb_immunity_turns: 0,
			bombs_pulled_in_level: 0,
			pullable_orbs: [new CairoCustomEnum({ 
					Empty: "",
				PointRewind: undefined,
				FiveOrDie: undefined,
				Point: undefined,
				PointPerOrbRemaining: undefined,
				PointPerBombPulled: undefined,
				GlitchChips: undefined,
				Moonrocks: undefined,
				Health: undefined,
				Bomb: undefined,
				Multiplier: undefined,
				BombImmunity: undefined, })],
			consumed_orbs: [new CairoCustomEnum({ 
					Empty: "",
				PointRewind: undefined,
				FiveOrDie: undefined,
				Point: undefined,
				PointPerOrbRemaining: undefined,
				PointPerBombPulled: undefined,
				GlitchChips: undefined,
				Moonrocks: undefined,
				Health: undefined,
				Bomb: undefined,
				Multiplier: undefined,
				BombImmunity: undefined, })],
		},
		Orb: {
		effect: new CairoCustomEnum({ 
					Empty: "",
				PointRewind: undefined,
				FiveOrDie: undefined,
				Point: undefined,
				PointPerOrbRemaining: undefined,
				PointPerBombPulled: undefined,
				GlitchChips: undefined,
				Moonrocks: undefined,
				Health: undefined,
				Bomb: undefined,
				Multiplier: undefined,
				BombImmunity: undefined, }),
			count: 0,
			base_price: 0,
			current_price: 0,
		},
		OrbsInGame: {
			player_id: "",
			gamepack_id: 0,
			game_id: 0,
			non_buyable: [{ effect: new CairoCustomEnum({ 
					Empty: "",
				PointRewind: undefined,
				FiveOrDie: undefined,
				Point: undefined,
				PointPerOrbRemaining: undefined,
				PointPerBombPulled: undefined,
				GlitchChips: undefined,
				Moonrocks: undefined,
				Health: undefined,
				Bomb: undefined,
				Multiplier: undefined,
				BombImmunity: undefined, }), count: 0, base_price: 0, current_price: 0, }],
			common: [{ effect: new CairoCustomEnum({ 
					Empty: "",
				PointRewind: undefined,
				FiveOrDie: undefined,
				Point: undefined,
				PointPerOrbRemaining: undefined,
				PointPerBombPulled: undefined,
				GlitchChips: undefined,
				Moonrocks: undefined,
				Health: undefined,
				Bomb: undefined,
				Multiplier: undefined,
				BombImmunity: undefined, }), count: 0, base_price: 0, current_price: 0, }],
			rare: [{ effect: new CairoCustomEnum({ 
					Empty: "",
				PointRewind: undefined,
				FiveOrDie: undefined,
				Point: undefined,
				PointPerOrbRemaining: undefined,
				PointPerBombPulled: undefined,
				GlitchChips: undefined,
				Moonrocks: undefined,
				Health: undefined,
				Bomb: undefined,
				Multiplier: undefined,
				BombImmunity: undefined, }), count: 0, base_price: 0, current_price: 0, }],
			cosmic: [{ effect: new CairoCustomEnum({ 
					Empty: "",
				PointRewind: undefined,
				FiveOrDie: undefined,
				Point: undefined,
				PointPerOrbRemaining: undefined,
				PointPerBombPulled: undefined,
				GlitchChips: undefined,
				Moonrocks: undefined,
				Health: undefined,
				Bomb: undefined,
				Multiplier: undefined,
				BombImmunity: undefined, }), count: 0, base_price: 0, current_price: 0, }],
		},
		GamePack: {
			player_id: "",
			gamepack_id: 0,
		state: new CairoCustomEnum({ 
					Empty: "",
				Unopened: undefined,
				InProgress: undefined,
				EndedEarly: undefined,
				Completed: undefined, }),
		data: { current_game_id: 0, accumulated_moonrocks: 0, },
		},
		GamePackData: {
			current_game_id: 0,
			accumulated_moonrocks: 0,
		},
		Player: {
			player_id: "",
		state: new CairoCustomEnum({ 
					Broke: "",
				Stacked: undefined, }),
		data: { usdc: 0, gamepacks_bought: 0, },
		},
		PlayerData: {
			usdc: 0,
			gamepacks_bought: 0,
		},
	},
};
export enum ModelsMapping {
	Game = 'dojo_starter-Game',
	GameData = 'dojo_starter-GameData',
	GameState = 'dojo_starter-GameState',
	Orb = 'dojo_starter-Orb',
	OrbEffect = 'dojo_starter-OrbEffect',
	OrbsInGame = 'dojo_starter-OrbsInGame',
	GamePack = 'dojo_starter-GamePack',
	GamePackData = 'dojo_starter-GamePackData',
	GamePackState = 'dojo_starter-GamePackState',
	Player = 'dojo_starter-Player',
	PlayerData = 'dojo_starter-PlayerData',
	PlayerState = 'dojo_starter-PlayerState',
}