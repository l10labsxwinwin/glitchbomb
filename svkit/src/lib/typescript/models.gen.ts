import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, BigNumberish } from 'starknet';

// Type definition for `glitchbomb::gbv3::models::game::Game` struct
export interface Game {
	player: string;
	gamepack_id: BigNumberish;
	game_id: BigNumberish;
	state: GameStateEnum;
	data: GameData;
}

// Type definition for `glitchbomb::gbv3::models::game::GameData` struct
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

// Type definition for `glitchbomb::gbv3::models::game::OrbsInGame` struct
export interface OrbsInGame {
	player: string;
	gamepack_id: BigNumberish;
	game_id: BigNumberish;
	non_buyable: Array<Orb>;
	common: Array<Orb>;
	rare: Array<Orb>;
	cosmic: Array<Orb>;
}

// Type definition for `glitchbomb::gbv3::models::gamepack::GamePack` struct
export interface GamePack {
	player: string;
	gamepack_id: BigNumberish;
	state: GamePackStateEnum;
	data: GamePackData;
}

// Type definition for `glitchbomb::gbv3::models::gamepack::GamePackData` struct
export interface GamePackData {
	current_game_id: BigNumberish;
	accumulated_moonrocks: BigNumberish;
}

// Type definition for `glitchbomb::gbv3::models::orb::Orb` struct
export interface Orb {
	effect: OrbEffectEnum;
	count: BigNumberish;
	base_price: BigNumberish;
	current_price: BigNumberish;
}

// Type definition for `glitchbomb::gbv3::models::player::Player` struct
export interface Player {
	player: string;
	state: PlayerStateEnum;
	data: PlayerData;
}

// Type definition for `glitchbomb::gbv3::models::player::PlayerData` struct
export interface PlayerData {
	usdc: BigNumberish;
	gamepacks_bought: BigNumberish;
}

// Type definition for `glitchbomb::gbv3::models::enums::GamePackState` enum
export const gamePackState = [
	'Unopened',
	'InProgress',
	'EndedEarly',
	'Completed',
] as const;
export type GamePackState = { [key in typeof gamePackState[number]]: string };
export type GamePackStateEnum = CairoCustomEnum;

// Type definition for `glitchbomb::gbv3::models::enums::GameState` enum
export const gameState = [
	'New',
	'Level',
	'LevelComplete',
	'FiveOrDiePhase',
	'Shop',
	'GameOver',
] as const;
export type GameState = { [key in typeof gameState[number]]: string };
export type GameStateEnum = CairoCustomEnum;

// Type definition for `glitchbomb::gbv3::models::enums::OrbEffect` enum
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

// Type definition for `glitchbomb::gbv3::models::enums::PlayerState` enum
export const playerState = [
	'Broke',
	'Stacked',
] as const;
export type PlayerState = { [key in typeof playerState[number]]: string };
export type PlayerStateEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	glitchbomb: {
		Game: Game,
		GameData: GameData,
		OrbsInGame: OrbsInGame,
		GamePack: GamePack,
		GamePackData: GamePackData,
		Orb: Orb,
		Player: Player,
		PlayerData: PlayerData,
	},
}
export const schema: SchemaType = {
	glitchbomb: {
		Game: {
			player: "",
			gamepack_id: 0,
			game_id: 0,
		state: new CairoCustomEnum({ 
					New: "",
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
		OrbsInGame: {
			player: "",
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
			player: "",
			gamepack_id: 0,
		state: new CairoCustomEnum({ 
					Unopened: "",
				InProgress: undefined,
				EndedEarly: undefined,
				Completed: undefined, }),
		data: { current_game_id: 0, accumulated_moonrocks: 0, },
		},
		GamePackData: {
			current_game_id: 0,
			accumulated_moonrocks: 0,
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
		Player: {
			player: "",
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
	GamePackState = 'glitchbomb-GamePackState',
	GameState = 'glitchbomb-GameState',
	OrbEffect = 'glitchbomb-OrbEffect',
	PlayerState = 'glitchbomb-PlayerState',
	Game = 'glitchbomb-Game',
	GameData = 'glitchbomb-GameData',
	OrbsInGame = 'glitchbomb-OrbsInGame',
	GamePack = 'glitchbomb-GamePack',
	GamePackData = 'glitchbomb-GamePackData',
	Orb = 'glitchbomb-Orb',
	Player = 'glitchbomb-Player',
	PlayerData = 'glitchbomb-PlayerData',
}