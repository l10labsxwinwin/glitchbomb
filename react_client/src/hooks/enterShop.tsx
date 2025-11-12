import { useAccount, useNetwork } from "@starknet-react/core";
import { useCallback } from "react";
import { CallData } from "starknet";
import { getGameAddress, getVrfAddress } from "../../config";

export const useEnterShop = () => {
  const { account } = useAccount();
  const { chain } = useNetwork();

  const enterShop = useCallback(async (gamepackId: number) => {
    try {
      if (!account?.address) return false;
      const vrfAddress = getVrfAddress(chain.id);
      const gameAddress = getGameAddress(chain.id);
      await account.execute([
        {
          contractAddress: vrfAddress,
          entrypoint: "request_random",
          calldata: CallData.compile({
            caller: gameAddress,
            source: { type: 0, address: gameAddress },
          }),
        },
        {
          contractAddress: gameAddress,
          entrypoint: "enter_shop",
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
    enterShop,
  };
};

