import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_player_actions_buyGamepack_calldata = (): DojoCall => {
		return {
			contractName: "player_actions",
			entrypoint: "buy_gamepack",
			calldata: [],
		};
	};

	const player_actions_buyGamepack = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_actions_buyGamepack_calldata(),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_actions_buyOrb_calldata = (gamepackId: BigNumberish, orbId: BigNumberish): DojoCall => {
		return {
			contractName: "player_actions",
			entrypoint: "buy_orb",
			calldata: [gamepackId, orbId],
		};
	};

	const player_actions_buyOrb = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish, orbId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_actions_buyOrb_calldata(gamepackId, orbId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_actions_cashOut_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "player_actions",
			entrypoint: "cash_out",
			calldata: [gamepackId],
		};
	};

	const player_actions_cashOut = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_actions_cashOut_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_actions_claimFreeUsdc_calldata = (): DojoCall => {
		return {
			contractName: "player_actions",
			entrypoint: "claim_free_usdc",
			calldata: [],
		};
	};

	const player_actions_claimFreeUsdc = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_actions_claimFreeUsdc_calldata(),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_actions_confirmFiveOrDie_calldata = (gamepackId: BigNumberish, confirmed: boolean): DojoCall => {
		return {
			contractName: "player_actions",
			entrypoint: "confirm_five_or_die",
			calldata: [gamepackId, confirmed],
		};
	};

	const player_actions_confirmFiveOrDie = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish, confirmed: boolean) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_actions_confirmFiveOrDie_calldata(gamepackId, confirmed),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_actions_enterShop_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "player_actions",
			entrypoint: "enter_shop",
			calldata: [gamepackId],
		};
	};

	const player_actions_enterShop = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_actions_enterShop_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_actions_nextGame_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "player_actions",
			entrypoint: "next_game",
			calldata: [gamepackId],
		};
	};

	const player_actions_nextGame = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_actions_nextGame_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_actions_nextLevel_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "player_actions",
			entrypoint: "next_level",
			calldata: [gamepackId],
		};
	};

	const player_actions_nextLevel = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_actions_nextLevel_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_actions_openGamepack_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "player_actions",
			entrypoint: "open_gamepack",
			calldata: [gamepackId],
		};
	};

	const player_actions_openGamepack = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_actions_openGamepack_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_actions_pullOrb_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "player_actions",
			entrypoint: "pull_orb",
			calldata: [gamepackId],
		};
	};

	const player_actions_pullOrb = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_actions_pullOrb_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_actions_startGame_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "player_actions",
			entrypoint: "start_game",
			calldata: [gamepackId],
		};
	};

	const player_actions_startGame = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_actions_startGame_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		player_actions: {
			buyGamepack: player_actions_buyGamepack,
			buildBuyGamepackCalldata: build_player_actions_buyGamepack_calldata,
			buyOrb: player_actions_buyOrb,
			buildBuyOrbCalldata: build_player_actions_buyOrb_calldata,
			cashOut: player_actions_cashOut,
			buildCashOutCalldata: build_player_actions_cashOut_calldata,
			claimFreeUsdc: player_actions_claimFreeUsdc,
			buildClaimFreeUsdcCalldata: build_player_actions_claimFreeUsdc_calldata,
			confirmFiveOrDie: player_actions_confirmFiveOrDie,
			buildConfirmFiveOrDieCalldata: build_player_actions_confirmFiveOrDie_calldata,
			enterShop: player_actions_enterShop,
			buildEnterShopCalldata: build_player_actions_enterShop_calldata,
			nextGame: player_actions_nextGame,
			buildNextGameCalldata: build_player_actions_nextGame_calldata,
			nextLevel: player_actions_nextLevel,
			buildNextLevelCalldata: build_player_actions_nextLevel_calldata,
			openGamepack: player_actions_openGamepack,
			buildOpenGamepackCalldata: build_player_actions_openGamepack_calldata,
			pullOrb: player_actions_pullOrb,
			buildPullOrbCalldata: build_player_actions_pullOrb_calldata,
			startGame: player_actions_startGame,
			buildStartGameCalldata: build_player_actions_startGame_calldata,
		},
	};
}