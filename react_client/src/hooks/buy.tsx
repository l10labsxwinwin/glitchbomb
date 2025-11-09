import { useAccount, useNetwork } from "@starknet-react/core";
import { useCallback } from "react";
import { CallData, uint256 } from "starknet";
import { getGameAddress, getTokenAddress } from "../../config";
import { DEFAULT_ENTRY_PRICE } from "@/constants";

export const useBuy = () => {
  const { account } = useAccount();
  const { chain } = useNetwork();

  const buy = useCallback(async () => {
    try {
      if (!account?.address) return false;
      const tokenAddress = getTokenAddress(chain.id);
      const gameAddress = getGameAddress(chain.id);
      await account.execute([
        {
          contractAddress: tokenAddress,
          entrypoint: "approve",
          calldata: CallData.compile({
            spender: gameAddress,
            amount: uint256.bnToUint256(DEFAULT_ENTRY_PRICE),
          }),
        },
        {
          contractAddress: gameAddress,
          entrypoint: "buy_gamepack",
          calldata: CallData.compile({}),
        },
      ]);

      return true;
    } catch (e) {
      console.log({ e });
      return false;
    }
  }, [account]);

  return {
    buy,
  };
};
