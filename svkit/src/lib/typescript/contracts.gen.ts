import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_gb_contract_v2_buyGamepack_calldata = (): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "buy_gamepack",
			calldata: [],
		};
	};

	const gb_contract_v2_buyGamepack = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_buyGamepack_calldata(),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_buyOrb_calldata = (gamepackId: BigNumberish, orbId: BigNumberish): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "buy_orb",
			calldata: [gamepackId, orbId],
		};
	};

	const gb_contract_v2_buyOrb = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish, orbId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_buyOrb_calldata(gamepackId, orbId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_cashOut_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "cash_out",
			calldata: [gamepackId],
		};
	};

	const gb_contract_v2_cashOut = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_cashOut_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_claimFreeUsdc_calldata = (): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "claim_free_usdc",
			calldata: [],
		};
	};

	const gb_contract_v2_claimFreeUsdc = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_claimFreeUsdc_calldata(),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_confirmFiveOrDie_calldata = (gamepackId: BigNumberish, confirmed: boolean): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "confirm_five_or_die",
			calldata: [gamepackId, confirmed],
		};
	};

	const gb_contract_v2_confirmFiveOrDie = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish, confirmed: boolean) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_confirmFiveOrDie_calldata(gamepackId, confirmed),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_enterShop_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "enter_shop",
			calldata: [gamepackId],
		};
	};

	const gb_contract_v2_enterShop = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_enterShop_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_nextGame_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "next_game",
			calldata: [gamepackId],
		};
	};

	const gb_contract_v2_nextGame = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_nextGame_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_nextLevel_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "next_level",
			calldata: [gamepackId],
		};
	};

	const gb_contract_v2_nextLevel = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_nextLevel_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_openGamepack_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "open_gamepack",
			calldata: [gamepackId],
		};
	};

	const gb_contract_v2_openGamepack = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_openGamepack_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_pullOrb_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "pull_orb",
			calldata: [gamepackId],
		};
	};

	const gb_contract_v2_pullOrb = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_pullOrb_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_startGame_calldata = (gamepackId: BigNumberish): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "start_game",
			calldata: [gamepackId],
		};
	};

	const gb_contract_v2_startGame = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_startGame_calldata(gamepackId),
				"glitchbomb",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		gb_contract_v2: {
			buyGamepack: gb_contract_v2_buyGamepack,
			buildBuyGamepackCalldata: build_gb_contract_v2_buyGamepack_calldata,
			buyOrb: gb_contract_v2_buyOrb,
			buildBuyOrbCalldata: build_gb_contract_v2_buyOrb_calldata,
			cashOut: gb_contract_v2_cashOut,
			buildCashOutCalldata: build_gb_contract_v2_cashOut_calldata,
			claimFreeUsdc: gb_contract_v2_claimFreeUsdc,
			buildClaimFreeUsdcCalldata: build_gb_contract_v2_claimFreeUsdc_calldata,
			confirmFiveOrDie: gb_contract_v2_confirmFiveOrDie,
			buildConfirmFiveOrDieCalldata: build_gb_contract_v2_confirmFiveOrDie_calldata,
			enterShop: gb_contract_v2_enterShop,
			buildEnterShopCalldata: build_gb_contract_v2_enterShop_calldata,
			nextGame: gb_contract_v2_nextGame,
			buildNextGameCalldata: build_gb_contract_v2_nextGame_calldata,
			nextLevel: gb_contract_v2_nextLevel,
			buildNextLevelCalldata: build_gb_contract_v2_nextLevel_calldata,
			openGamepack: gb_contract_v2_openGamepack,
			buildOpenGamepackCalldata: build_gb_contract_v2_openGamepack_calldata,
			pullOrb: gb_contract_v2_pullOrb,
			buildPullOrbCalldata: build_gb_contract_v2_pullOrb_calldata,
			startGame: gb_contract_v2_startGame,
			buildStartGameCalldata: build_gb_contract_v2_startGame_calldata,
		},
	};
}