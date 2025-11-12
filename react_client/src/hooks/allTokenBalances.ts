import { useDojoSDK } from "@dojoengine/sdk/react";
import type {
  Subscription,
  TokenBalance,
} from "@dojoengine/torii-wasm";
import type { SubscriptionCallbackArgs } from "@dojoengine/sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addAddressPadding } from "starknet";

/**
 * Hook to fetch all ERC721 token balances for a given contract.
 * Returns a map of token_id -> owner address for all owned tokens.
 */
export function useAllTokenBalances(contractAddress: string) {
  const { sdk } = useDojoSDK();
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.cancel();
      }
    };
  }, []);

  const fetchTokenBalances = useCallback(async () => {
    if (!sdk || !contractAddress) return;

    try {
      // Query all token balances by providing only contract address, no account filter
      const [balances, subscription] = await sdk.subscribeTokenBalance({
        contractAddresses: [addAddressPadding(contractAddress)],
        accountAddresses: [], // Empty array means get all balances
        callback: ({ data, error }: SubscriptionCallbackArgs<TokenBalance>) => {
          if (error) {
            console.error(error);
            return;
          }
          setTokenBalances((prev) => update(prev, data));
        },
      });

      if (subscriptionRef.current) {
        subscriptionRef.current.cancel();
      }

      subscriptionRef.current = subscription;
      // Filter for ERC721 tokens with balance > 0 (owned tokens)
      const ownedTokens = balances.items.filter(
        (balance) => BigInt(balance.balance || "0x0") > 0n
      );
      setTokenBalances(ownedTokens);
    } catch (error) {
      console.error("Error fetching all token balances:", error);
    }
  }, [sdk, contractAddress]);

  useEffect(() => {
    fetchTokenBalances();
  }, [fetchTokenBalances]);

  // Create a map of token_id -> owner address
  const owners = useMemo(() => {
    const map: Record<number, string> = {};
    tokenBalances.forEach((balance) => {
      if (balance.token_id && BigInt(balance.balance || "0x0") > 0n) {
        const tokenId = parseInt(balance.token_id, 16);
        if (tokenId > 0 && balance.account_address) {
          map[tokenId] = balance.account_address;
        }
      }
    });
    return map;
  }, [tokenBalances]);

  return {
    owners,
    balances: tokenBalances,
    loading: false,
  };
}

function update(
  previousBalances: TokenBalance[],
  newBalance: TokenBalance,
): TokenBalance[] {
  // Filter out zero balances
  if (
    BigInt(newBalance.account_address) === 0n &&
    BigInt(newBalance.contract_address) === 0n
  ) {
    return previousBalances;
  }

  // Only include balances > 0 (owned tokens)
  if (BigInt(newBalance.balance || "0x0") === 0n) {
    return previousBalances;
  }

  const existingBalanceIndex = previousBalances.findIndex(
    (balance) =>
      BigInt(balance.token_id || 0) === BigInt(newBalance.token_id || 0) &&
      BigInt(balance.contract_address) ===
        BigInt(newBalance.contract_address) &&
      BigInt(balance.account_address) === BigInt(newBalance.account_address),
  );

  // If balance doesn't exist, append it to the list
  if (existingBalanceIndex === -1) {
    return [...previousBalances, newBalance];
  }

  // If balance exists, update it while preserving order
  return previousBalances.map((balance, index) =>
    index === existingBalanceIndex ? newBalance : balance,
  );
}

