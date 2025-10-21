import { defineComponent, Type as RecsType, type World } from "@dojoengine/recs";
import type { ContractComponents } from "./contractComponents";

export function defineContractComponents(world: World): ContractComponents {
    return {
        Game: (() => {
            return defineComponent(
                world,
                {
                    player_id: RecsType.String,
                    gamepack_id: RecsType.BigInt,
                    game_id: RecsType.BigInt,
                    state: RecsType.String,
                    level: RecsType.BigInt,
                    pull_number: RecsType.BigInt,
                    points: RecsType.BigInt,
                    milestone: RecsType.BigInt,
                    hp: RecsType.BigInt,
                    multiplier: RecsType.BigInt,
                    glitch_chips: RecsType.BigInt,
                    moonrocks_spent: RecsType.BigInt,
                    moonrocks_earned: RecsType.BigInt,
                    temp_moonrocks: RecsType.BigInt,
                    bomb_immunity_turns: RecsType.BigInt,
                    bombs_pulled_in_level: RecsType.BigInt,
                },
                {
                    metadata: {
                        namespace: "glitchbomb",
                        name: "Game",
                    },
                }
            );
        })(),
        OrbsInGame: (() => {
            return defineComponent(
                world,
                {
                    player_id: RecsType.String,
                    gamepack_id: RecsType.BigInt,
                    game_id: RecsType.BigInt,
                },
                {
                    metadata: {
                        namespace: "glitchbomb",
                        name: "OrbsInGame",
                    },
                }
            );
        })(),
        GamePack: (() => {
            return defineComponent(
                world,
                {
                    player_id: RecsType.String,
                    gamepack_id: RecsType.BigInt,
                    state: RecsType.String,
                    current_game_id: RecsType.BigInt,
                    accumulated_moonrocks: RecsType.BigInt,
                },
                {
                    metadata: {
                        namespace: "glitchbomb",
                        name: "GamePack",
                    },
                }
            );
        })(),
        Player: (() => {
            return defineComponent(
                world,
                {
                    player_id: RecsType.String,
                    state: RecsType.String,
                    usdc: RecsType.BigInt,
                    gamepacks_bought: RecsType.BigInt,
                },
                {
                    metadata: {
                        namespace: "glitchbomb",
                        name: "Player",
                    },
                }
            );
        })(),
    };
}
