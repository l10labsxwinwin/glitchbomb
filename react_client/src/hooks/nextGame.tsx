import { useAccount, useNetwork } from "@starknet-react/core";
import { useCallback } from "react";
import { CallData } from "starknet";
import { getGameAddress } from "../../config";

export const useNextGame = () => {
  const { account } = useAccount();
  const { chain } = useNetwork();

  const nextGame = useCallback(async (gamepackId: number) => {
    try {
      if (!account?.address) return false;
      const gameAddress = getGameAddress(chain.id);
      await account.execute([
        {
          contractAddress: gameAddress,
          entrypoint: "next_game",
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
    nextGame,
  };
};

