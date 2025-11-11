import { useAccount, useNetwork } from "@starknet-react/core";
import { useCallback } from "react";
import { CallData } from "starknet";
import { getGameAddress } from "../../config";

export const useBuyCommon = () => {
  const { account } = useAccount();
  const { chain } = useNetwork();

  const buyCommon = useCallback(async (gamepackId: number, index: number) => {
    try {
      if (!account?.address) return false;
      const gameAddress = getGameAddress(chain.id);
      await account.execute([
        {
          contractAddress: gameAddress,
          entrypoint: "buy_common",
          calldata: CallData.compile({
            gamepackId: gamepackId,
            index: index,
          }),
        },
      ]);

      return true;
    } catch (e) {
      console.log({ e });
      return false;
    }
  }, [account, chain]);

  return {
    buyCommon,
  };
};

