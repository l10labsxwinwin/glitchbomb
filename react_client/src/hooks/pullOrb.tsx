import { useAccount, useNetwork } from "@starknet-react/core";
import { useCallback } from "react";
import { CallData } from "starknet";
import { getGameAddress } from "../../config";

export const usePullOrb = () => {
  const { account } = useAccount();
  const { chain } = useNetwork();

  const pullOrb = useCallback(async (gamepackId: number) => {
    try {
      if (!account?.address) return false;
      const gameAddress = getGameAddress(chain.id);
      await account.execute([
        {
          contractAddress: gameAddress,
          entrypoint: "pull_orb",
          calldata: CallData.compile({
            gamepackId: gamepackId,
          }),
        },
      ]);

      return true;
    } catch (e) {
      console.log({ e });
      return false;
    }
  }, [account]);

  return {
    pullOrb,
  };
};
