import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_Collection_approve_calldata = (to: string, tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "approve",
			calldata: [to, tokenId],
		};
	};

	const Collection_approve = async (snAccount: Account | AccountInterface, to: string, tokenId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Collection_approve_calldata(to, tokenId),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_balanceOf_calldata = (account: string): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "balance_of",
			calldata: [account],
		};
	};

	const Collection_balanceOf = async (account: string) => {
		try {
			return await provider.call("GLITCHBOMB", build_Collection_balanceOf_calldata(account));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_burn_calldata = (tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "burn",
			calldata: [tokenId],
		};
	};

	const Collection_burn = async (snAccount: Account | AccountInterface, tokenId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Collection_burn_calldata(tokenId),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_getApproved_calldata = (tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "get_approved",
			calldata: [tokenId],
		};
	};

	const Collection_getApproved = async (tokenId: BigNumberish) => {
		try {
			return await provider.call("GLITCHBOMB", build_Collection_getApproved_calldata(tokenId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_getRoleAdmin_calldata = (role: BigNumberish): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "get_role_admin",
			calldata: [role],
		};
	};

	const Collection_getRoleAdmin = async (role: BigNumberish) => {
		try {
			return await provider.call("GLITCHBOMB", build_Collection_getRoleAdmin_calldata(role));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_grantRole_calldata = (role: BigNumberish, account: string): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "grant_role",
			calldata: [role, account],
		};
	};

	const Collection_grantRole = async (snAccount: Account | AccountInterface, role: BigNumberish, account: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_Collection_grantRole_calldata(role, account),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_hasRole_calldata = (role: BigNumberish, account: string): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "has_role",
			calldata: [role, account],
		};
	};

	const Collection_hasRole = async (role: BigNumberish, account: string) => {
		try {
			return await provider.call("GLITCHBOMB", build_Collection_hasRole_calldata(role, account));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_isApprovedForAll_calldata = (owner: string, operator: string): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "is_approved_for_all",
			calldata: [owner, operator],
		};
	};

	const Collection_isApprovedForAll = async (owner: string, operator: string) => {
		try {
			return await provider.call("GLITCHBOMB", build_Collection_isApprovedForAll_calldata(owner, operator));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_mint_calldata = (to: string, tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "mint",
			calldata: [to, tokenId],
		};
	};

	const Collection_mint = async (snAccount: Account | AccountInterface, to: string, tokenId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Collection_mint_calldata(to, tokenId),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_name_calldata = (): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "name",
			calldata: [],
		};
	};

	const Collection_name = async () => {
		try {
			return await provider.call("GLITCHBOMB", build_Collection_name_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_owner_calldata = (): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "owner",
			calldata: [],
		};
	};

	const Collection_owner = async () => {
		try {
			return await provider.call("GLITCHBOMB", build_Collection_owner_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_ownerOf_calldata = (tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "owner_of",
			calldata: [tokenId],
		};
	};

	const Collection_ownerOf = async (tokenId: BigNumberish) => {
		try {
			return await provider.call("GLITCHBOMB", build_Collection_ownerOf_calldata(tokenId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_renounceOwnership_calldata = (): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "renounce_ownership",
			calldata: [],
		};
	};

	const Collection_renounceOwnership = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_Collection_renounceOwnership_calldata(),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_renounceRole_calldata = (role: BigNumberish, account: string): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "renounce_role",
			calldata: [role, account],
		};
	};

	const Collection_renounceRole = async (snAccount: Account | AccountInterface, role: BigNumberish, account: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_Collection_renounceRole_calldata(role, account),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_revokeRole_calldata = (role: BigNumberish, account: string): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "revoke_role",
			calldata: [role, account],
		};
	};

	const Collection_revokeRole = async (snAccount: Account | AccountInterface, role: BigNumberish, account: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_Collection_revokeRole_calldata(role, account),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_safeTransferFrom_calldata = (from: string, to: string, tokenId: BigNumberish, data: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "safe_transfer_from",
			calldata: [from, to, tokenId, data],
		};
	};

	const Collection_safeTransferFrom = async (snAccount: Account | AccountInterface, from: string, to: string, tokenId: BigNumberish, data: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_Collection_safeTransferFrom_calldata(from, to, tokenId, data),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_setApprovalForAll_calldata = (operator: string, approved: boolean): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "set_approval_for_all",
			calldata: [operator, approved],
		};
	};

	const Collection_setApprovalForAll = async (snAccount: Account | AccountInterface, operator: string, approved: boolean) => {
		try {
			return await provider.execute(
				snAccount,
				build_Collection_setApprovalForAll_calldata(operator, approved),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_symbol_calldata = (): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "symbol",
			calldata: [],
		};
	};

	const Collection_symbol = async () => {
		try {
			return await provider.call("GLITCHBOMB", build_Collection_symbol_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_tokenUri_calldata = (tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "token_uri",
			calldata: [tokenId],
		};
	};

	const Collection_tokenUri = async (tokenId: BigNumberish) => {
		try {
			return await provider.call("GLITCHBOMB", build_Collection_tokenUri_calldata(tokenId));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_transferFrom_calldata = (from: string, to: string, tokenId: BigNumberish): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "transfer_from",
			calldata: [from, to, tokenId],
		};
	};

	const Collection_transferFrom = async (snAccount: Account | AccountInterface, from: string, to: string, tokenId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Collection_transferFrom_calldata(from, to, tokenId),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Collection_transferOwnership_calldata = (newOwner: string): DojoCall => {
		return {
			contractName: "Collection",
			entrypoint: "transfer_ownership",
			calldata: [newOwner],
		};
	};

	const Collection_transferOwnership = async (snAccount: Account | AccountInterface, newOwner: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_Collection_transferOwnership_calldata(newOwner),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Token_allowance_calldata = (owner: string, spender: string): DojoCall => {
		return {
			contractName: "Token",
			entrypoint: "allowance",
			calldata: [owner, spender],
		};
	};

	const Token_allowance = async (owner: string, spender: string) => {
		try {
			return await provider.call("GLITCHBOMB", build_Token_allowance_calldata(owner, spender));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Token_approve_calldata = (spender: string, amount: BigNumberish): DojoCall => {
		return {
			contractName: "Token",
			entrypoint: "approve",
			calldata: [spender, amount],
		};
	};

	const Token_approve = async (snAccount: Account | AccountInterface, spender: string, amount: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Token_approve_calldata(spender, amount),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Token_balanceOf_calldata = (account: string): DojoCall => {
		return {
			contractName: "Token",
			entrypoint: "balance_of",
			calldata: [account],
		};
	};

	const Token_balanceOf = async (account: string) => {
		try {
			return await provider.call("GLITCHBOMB", build_Token_balanceOf_calldata(account));
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Token_burn_calldata = (amount: BigNumberish): DojoCall => {
		return {
			contractName: "Token",
			entrypoint: "burn",
			calldata: [amount],
		};
	};

	const Token_burn = async (snAccount: Account | AccountInterface, amount: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Token_burn_calldata(amount),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Token_decimals_calldata = (): DojoCall => {
		return {
			contractName: "Token",
			entrypoint: "decimals",
			calldata: [],
		};
	};

	const Token_decimals = async () => {
		try {
			return await provider.call("GLITCHBOMB", build_Token_decimals_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Token_mint_calldata = (recipient: string, amount: BigNumberish): DojoCall => {
		return {
			contractName: "Token",
			entrypoint: "mint",
			calldata: [recipient, amount],
		};
	};

	const Token_mint = async (snAccount: Account | AccountInterface, recipient: string, amount: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Token_mint_calldata(recipient, amount),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Token_name_calldata = (): DojoCall => {
		return {
			contractName: "Token",
			entrypoint: "name",
			calldata: [],
		};
	};

	const Token_name = async () => {
		try {
			return await provider.call("GLITCHBOMB", build_Token_name_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Token_symbol_calldata = (): DojoCall => {
		return {
			contractName: "Token",
			entrypoint: "symbol",
			calldata: [],
		};
	};

	const Token_symbol = async () => {
		try {
			return await provider.call("GLITCHBOMB", build_Token_symbol_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Token_totalSupply_calldata = (): DojoCall => {
		return {
			contractName: "Token",
			entrypoint: "total_supply",
			calldata: [],
		};
	};

	const Token_totalSupply = async () => {
		try {
			return await provider.call("GLITCHBOMB", build_Token_totalSupply_calldata());
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Token_transfer_calldata = (recipient: string, amount: BigNumberish): DojoCall => {
		return {
			contractName: "Token",
			entrypoint: "transfer",
			calldata: [recipient, amount],
		};
	};

	const Token_transfer = async (snAccount: Account | AccountInterface, recipient: string, amount: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Token_transfer_calldata(recipient, amount),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Token_transferFrom_calldata = (sender: string, recipient: string, amount: BigNumberish): DojoCall => {
		return {
			contractName: "Token",
			entrypoint: "transfer_from",
			calldata: [sender, recipient, amount],
		};
	};

	const Token_transferFrom = async (snAccount: Account | AccountInterface, sender: string, recipient: string, amount: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Token_transferFrom_calldata(sender, recipient, amount),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_VRF_assertConsumed_calldata = (source: CairoCustomEnum): DojoCall => {
		return {
			contractName: "VRF",
			entrypoint: "assert_consumed",
			calldata: [source],
		};
	};

	const VRF_assertConsumed = async (snAccount: Account | AccountInterface, source: CairoCustomEnum) => {
		try {
			return await provider.execute(
				snAccount,
				build_VRF_assertConsumed_calldata(source),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_VRF_consumeRandom_calldata = (source: CairoCustomEnum): DojoCall => {
		return {
			contractName: "VRF",
			entrypoint: "consume_random",
			calldata: [source],
		};
	};

	const VRF_consumeRandom = async (snAccount: Account | AccountInterface, source: CairoCustomEnum) => {
		try {
			return await provider.execute(
				snAccount,
				build_VRF_consumeRandom_calldata(source),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_VRF_requestRandom_calldata = (caller: string, source: CairoCustomEnum): DojoCall => {
		return {
			contractName: "VRF",
			entrypoint: "request_random",
			calldata: [caller, source],
		};
	};

	const VRF_requestRandom = async (snAccount: Account | AccountInterface, caller: string, source: CairoCustomEnum) => {
		try {
			return await provider.execute(
				snAccount,
				build_VRF_requestRandom_calldata(caller, source),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_buyCommon_calldata = (gamepackId: BigNumberish, index: BigNumberish): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "buy_common",
			calldata: [gamepackId, index],
		};
	};

	const gb_contract_v2_buyCommon = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish, index: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_buyCommon_calldata(gamepackId, index),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_buyCosmic_calldata = (gamepackId: BigNumberish, index: BigNumberish): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "buy_cosmic",
			calldata: [gamepackId, index],
		};
	};

	const gb_contract_v2_buyCosmic = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish, index: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_buyCosmic_calldata(gamepackId, index),
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

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
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gb_contract_v2_buyRare_calldata = (gamepackId: BigNumberish, index: BigNumberish): DojoCall => {
		return {
			contractName: "gb_contract_v2",
			entrypoint: "buy_rare",
			calldata: [gamepackId, index],
		};
	};

	const gb_contract_v2_buyRare = async (snAccount: Account | AccountInterface, gamepackId: BigNumberish, index: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_gb_contract_v2_buyRare_calldata(gamepackId, index),
				"GLITCHBOMB",
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
				"GLITCHBOMB",
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
				"GLITCHBOMB",
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
				"GLITCHBOMB",
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
				"GLITCHBOMB",
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
				"GLITCHBOMB",
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
				"GLITCHBOMB",
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
				"GLITCHBOMB",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		Collection: {
			approve: Collection_approve,
			buildApproveCalldata: build_Collection_approve_calldata,
			balanceOf: Collection_balanceOf,
			buildBalanceOfCalldata: build_Collection_balanceOf_calldata,
			burn: Collection_burn,
			buildBurnCalldata: build_Collection_burn_calldata,
			getApproved: Collection_getApproved,
			buildGetApprovedCalldata: build_Collection_getApproved_calldata,
			getRoleAdmin: Collection_getRoleAdmin,
			buildGetRoleAdminCalldata: build_Collection_getRoleAdmin_calldata,
			grantRole: Collection_grantRole,
			buildGrantRoleCalldata: build_Collection_grantRole_calldata,
			hasRole: Collection_hasRole,
			buildHasRoleCalldata: build_Collection_hasRole_calldata,
			isApprovedForAll: Collection_isApprovedForAll,
			buildIsApprovedForAllCalldata: build_Collection_isApprovedForAll_calldata,
			mint: Collection_mint,
			buildMintCalldata: build_Collection_mint_calldata,
			name: Collection_name,
			buildNameCalldata: build_Collection_name_calldata,
			owner: Collection_owner,
			buildOwnerCalldata: build_Collection_owner_calldata,
			ownerOf: Collection_ownerOf,
			buildOwnerOfCalldata: build_Collection_ownerOf_calldata,
			renounceOwnership: Collection_renounceOwnership,
			buildRenounceOwnershipCalldata: build_Collection_renounceOwnership_calldata,
			renounceRole: Collection_renounceRole,
			buildRenounceRoleCalldata: build_Collection_renounceRole_calldata,
			revokeRole: Collection_revokeRole,
			buildRevokeRoleCalldata: build_Collection_revokeRole_calldata,
			safeTransferFrom: Collection_safeTransferFrom,
			buildSafeTransferFromCalldata: build_Collection_safeTransferFrom_calldata,
			setApprovalForAll: Collection_setApprovalForAll,
			buildSetApprovalForAllCalldata: build_Collection_setApprovalForAll_calldata,
			symbol: Collection_symbol,
			buildSymbolCalldata: build_Collection_symbol_calldata,
			tokenUri: Collection_tokenUri,
			buildTokenUriCalldata: build_Collection_tokenUri_calldata,
			transferFrom: Collection_transferFrom,
			buildTransferFromCalldata: build_Collection_transferFrom_calldata,
			transferOwnership: Collection_transferOwnership,
			buildTransferOwnershipCalldata: build_Collection_transferOwnership_calldata,
		},
		Token: {
			allowance: Token_allowance,
			buildAllowanceCalldata: build_Token_allowance_calldata,
			approve: Token_approve,
			buildApproveCalldata: build_Token_approve_calldata,
			balanceOf: Token_balanceOf,
			buildBalanceOfCalldata: build_Token_balanceOf_calldata,
			burn: Token_burn,
			buildBurnCalldata: build_Token_burn_calldata,
			decimals: Token_decimals,
			buildDecimalsCalldata: build_Token_decimals_calldata,
			mint: Token_mint,
			buildMintCalldata: build_Token_mint_calldata,
			name: Token_name,
			buildNameCalldata: build_Token_name_calldata,
			symbol: Token_symbol,
			buildSymbolCalldata: build_Token_symbol_calldata,
			totalSupply: Token_totalSupply,
			buildTotalSupplyCalldata: build_Token_totalSupply_calldata,
			transfer: Token_transfer,
			buildTransferCalldata: build_Token_transfer_calldata,
			transferFrom: Token_transferFrom,
			buildTransferFromCalldata: build_Token_transferFrom_calldata,
		},
		VRF: {
			assertConsumed: VRF_assertConsumed,
			buildAssertConsumedCalldata: build_VRF_assertConsumed_calldata,
			consumeRandom: VRF_consumeRandom,
			buildConsumeRandomCalldata: build_VRF_consumeRandom_calldata,
			requestRandom: VRF_requestRandom,
			buildRequestRandomCalldata: build_VRF_requestRandom_calldata,
		},
		gb_contract_v2: {
			buyCommon: gb_contract_v2_buyCommon,
			buildBuyCommonCalldata: build_gb_contract_v2_buyCommon_calldata,
			buyCosmic: gb_contract_v2_buyCosmic,
			buildBuyCosmicCalldata: build_gb_contract_v2_buyCosmic_calldata,
			buyGamepack: gb_contract_v2_buyGamepack,
			buildBuyGamepackCalldata: build_gb_contract_v2_buyGamepack_calldata,
			buyRare: gb_contract_v2_buyRare,
			buildBuyRareCalldata: build_gb_contract_v2_buyRare_calldata,
			cashOut: gb_contract_v2_cashOut,
			buildCashOutCalldata: build_gb_contract_v2_cashOut_calldata,
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