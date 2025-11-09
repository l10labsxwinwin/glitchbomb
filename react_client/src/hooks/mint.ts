import { useAccount, useNetwork } from "@starknet-react/core";
import { useCallback } from "react";
import { uint256 } from "starknet";
import { getTokenAddress } from "../../config";

export const useMint = () => {
  const { account } = useAccount();
  const { chain } = useNetwork();

  const mint = useCallback(async () => {
    try {
      if (!account || !account.address) return false;
      const tokenAddress = getTokenAddress(chain.id);
      await account.execute([
        {
          contractAddress: tokenAddress,
          entrypoint: "mint",
          calldata: [
            account.address,
            uint256.bnToUint256(10_000n * 10n ** 18n),
          ],
        },
      ]);

      return true;
    } catch (e) {
      console.log({ e });
      return false;
    }
  }, [account]);

  return {
    mint,
  };
};
