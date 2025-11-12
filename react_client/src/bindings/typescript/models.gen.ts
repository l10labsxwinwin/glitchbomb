import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, BigNumberish } from 'starknet';

// Type definition for `glitchbomb::glitchbombv2::game::Game` struct
export interface Game {
	gamepack_id: BigNumberish;
	game_id: BigNumberish;
	state: GameStateEnum;
	data: GameData;
}

// Type definition for `glitchbomb::glitchbombv2::game::GameData` struct
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

// Type definition for `glitchbomb::glitchbombv2::game::Orb` struct
export interface Orb {
	effect: OrbEffectEnum;
	count: BigNumberish;
	base_price: BigNumberish;
	current_price: BigNumberish;
}

// Type definition for `glitchbomb::glitchbombv2::game::OrbsInGame` struct
export interface OrbsInGame {
	gamepack_id: BigNumberish;
	game_id: BigNumberish;
	non_buyable: Array<Orb>;
	common: Array<Orb>;
	rare: Array<Orb>;
	cosmic: Array<Orb>;
}

// Type definition for `glitchbomb::glitchbombv2::gamepack::GamePack` struct
export interface GamePack {
	gamepack_id: BigNumberish;
	state: GamePackStateEnum;
	data: GamePackData;
}

// Type definition for `glitchbomb::glitchbombv2::gamepack::GamePackData` struct
export interface GamePackData {
	current_game_id: BigNumberish;
	accumulated_moonrocks: BigNumberish;
}

// Type definition for `glitchbomb::models::config::Config` struct
export interface Config {
	id: BigNumberish;
	collection: string;
	token: string;
	vrf: string;
}

// Type definition for `glitchbomb::events::index::GameEvent` struct
export interface GameEvent {
	gamepack_id: BigNumberish;
	game_id: BigNumberish;
	tick: BigNumberish;
	state: GameStateEnum;
	data: GameData;
}

// Type definition for `openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged` struct
export interface RoleAdminChanged {
	role: BigNumberish;
	previous_admin_role: BigNumberish;
	new_admin_role: BigNumberish;
}

// Type definition for `openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted` struct
export interface RoleGranted {
	role: BigNumberish;
	account: string;
	sender: string;
}

// Type definition for `openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGrantedWithDelay` struct
export interface RoleGrantedWithDelay {
	role: BigNumberish;
	account: string;
	sender: string;
	delay: BigNumberish;
}

// Type definition for `openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked` struct
export interface RoleRevoked {
	role: BigNumberish;
	account: string;
	sender: string;
}

// Type definition for `openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted` struct
export interface OwnershipTransferStarted {
	previous_owner: string;
	new_owner: string;
}

// Type definition for `openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred` struct
export interface OwnershipTransferred {
	previous_owner: string;
	new_owner: string;
}

// Type definition for `openzeppelin_token::erc721::erc721::ERC721Component::Approval` struct
export interface Approval {
	owner: string;
	approved: string;
	token_id: BigNumberish;
}

// Type definition for `openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll` struct
export interface ApprovalForAll {
	owner: string;
	operator: string;
	approved: boolean;
}

// Type definition for `openzeppelin_token::erc721::erc721::ERC721Component::Transfer` struct
export interface Transfer {
	from: string;
	to: string;
	token_id: BigNumberish;
}

// Type definition for `glitchbomb::glitchbombv2::game::GameState` enum
export const gameState = [
	'Empty',
	'New',
	'Level',
	'LevelComplete',
	'Shop',
	'GameOver',
] as const;
export type GameState = { [key in typeof gameState[number]]: string };
export type GameStateEnum = CairoCustomEnum;

// Type definition for `glitchbomb::glitchbombv2::game::OrbEffect` enum
export const orbEffect = [
	'Empty',
	'PointRewind',
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

// Type definition for `glitchbomb::glitchbombv2::gamepack::GamePackState` enum
export const gamePackState = [
	'Empty',
	'Unopened',
	'InProgress',
	'EndedEarly',
	'Completed',
] as const;
export type GamePackState = { [key in typeof gamePackState[number]]: string };
export type GamePackStateEnum = CairoCustomEnum;

// Type definition for `glitchbomb::interfaces::vrf::Source` enum
export const source = [
	'Nonce',
	'Salt',
] as const;
export type Source = { [key in typeof source[number]]: string };
export type SourceEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	glitchbomb: {
		Game: Game,
		GameData: GameData,
		Orb: Orb,
		OrbsInGame: OrbsInGame,
		GamePack: GamePack,
		GamePackData: GamePackData,
		Config: Config,
		GameEvent: GameEvent,
		RoleAdminChanged: RoleAdminChanged,
		RoleGranted: RoleGranted,
		RoleGrantedWithDelay: RoleGrantedWithDelay,
		RoleRevoked: RoleRevoked,
		OwnershipTransferStarted: OwnershipTransferStarted,
		OwnershipTransferred: OwnershipTransferred,
		Approval: Approval,
		Transfer: Transfer,
		ApprovalForAll: ApprovalForAll,
	},
}
export const schema: SchemaType = {
	glitchbomb: {
		Game: {
			gamepack_id: 0,
			game_id: 0,
		state: new CairoCustomEnum({ 
					Empty: "",
				New: undefined,
				Level: undefined,
				LevelComplete: undefined,
				Shop: undefined,
				GameOver: undefined, }),
		data: { level: 0, pull_number: 0, points: 0, milestone: 0, hp: 0, multiplier: 0, glitch_chips: 0, moonrocks_spent: 0, moonrocks_earned: 0, temp_moonrocks: 0, bomb_immunity_turns: 0, bombs_pulled_in_level: 0, pullable_orbs: [new CairoCustomEnum({ 
					Empty: "",
				PointRewind: undefined,
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
			gamepack_id: 0,
			game_id: 0,
			non_buyable: [{ effect: new CairoCustomEnum({ 
					Empty: "",
				PointRewind: undefined,
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
		Config: {
			id: 0,
			collection: "",
			token: "",
			vrf: "",
		},
		GameEvent: {
			gamepack_id: 0,
			game_id: 0,
			tick: 0,
		state: new CairoCustomEnum({ 
					Empty: "",
				New: undefined,
				Level: undefined,
				LevelComplete: undefined,
				Shop: undefined,
				GameOver: undefined, }),
		data: { level: 0, pull_number: 0, points: 0, milestone: 0, hp: 0, multiplier: 0, glitch_chips: 0, moonrocks_spent: 0, moonrocks_earned: 0, temp_moonrocks: 0, bomb_immunity_turns: 0, bombs_pulled_in_level: 0, pullable_orbs: [new CairoCustomEnum({ 
					Empty: "",
				PointRewind: undefined,
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
		RoleAdminChanged: {
			role: 0,
			previous_admin_role: 0,
			new_admin_role: 0,
		},
		RoleGranted: {
			role: 0,
			account: "",
			sender: "",
		},
		RoleGrantedWithDelay: {
			role: 0,
			account: "",
			sender: "",
			delay: 0,
		},
		RoleRevoked: {
			role: 0,
			account: "",
			sender: "",
		},
		OwnershipTransferStarted: {
			previous_owner: "",
			new_owner: "",
		},
		OwnershipTransferred: {
			previous_owner: "",
			new_owner: "",
		},
		Approval: {
			owner: "",
			approved: "",
		token_id: 0,
		},
		ApprovalForAll: {
			owner: "",
			operator: "",
			approved: false,
		},
		Transfer: {
			from: "",
			to: "",
		token_id: 0,
		},
	},
};
export enum ModelsMapping {
	Game = 'glitchbomb-Game',
	GameData = 'glitchbomb-GameData',
	GameState = 'glitchbomb-GameState',
	Orb = 'glitchbomb-Orb',
	OrbEffect = 'glitchbomb-OrbEffect',
	OrbsInGame = 'glitchbomb-OrbsInGame',
	GamePack = 'glitchbomb-GamePack',
	GamePackData = 'glitchbomb-GamePackData',
	GamePackState = 'glitchbomb-GamePackState',
	Config = 'glitchbomb-Config',
	GameEvent = 'glitchbomb-GameEvent',
	Source = 'glitchbomb-Source',
	RoleAdminChanged = 'openzeppelin_access-RoleAdminChanged',
	RoleGranted = 'openzeppelin_access-RoleGranted',
	RoleGrantedWithDelay = 'openzeppelin_access-RoleGrantedWithDelay',
	RoleRevoked = 'openzeppelin_access-RoleRevoked',
	OwnershipTransferStarted = 'openzeppelin_access-OwnershipTransferStarted',
	OwnershipTransferred = 'openzeppelin_access-OwnershipTransferred',
	Approval = 'openzeppelin_token-Approval',
	Transfer = 'openzeppelin_token-Transfer',
	ApprovalForAll = 'openzeppelin_token-ApprovalForAll',
}