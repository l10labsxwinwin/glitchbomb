import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import ControllerConnector from "@cartridge/connector/controller";
import type { ControllerOptions, SessionPolicies } from "@cartridge/controller";

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import { DojoSdkProviderInitialized } from "./context/dojo";
import { chains, DEFAULT_CHAIN_ID, getGameAddress, getTokenAddress } from "../config";
import { type Chain, mainnet, sepolia } from "@starknet-react/chains";
import {
  type Connector,
  jsonRpcProvider,
  StarknetConfig,
  voyager,
} from "@starknet-react/core";

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const buildChains = () => {
  const chain = chains[DEFAULT_CHAIN_ID];
  switch (chain) {
    case mainnet:
      return [{ rpcUrl: chain.rpcUrls.cartridge.http[0] }];
    case sepolia:
      return [{ rpcUrl: chain.rpcUrls.cartridge.http[0] }];
    default:
      throw new Error(`Unsupported chain: ${chain.network}`);
  }
};

const buildPolicies = (): SessionPolicies => {
  // Get contract addresses for both chains
  const sepoliaChainId = BigInt(sepolia.id);
  const mainnetChainId = BigInt(mainnet.id);
  
  const sepoliaGameAddress = getGameAddress(sepoliaChainId);
  const mainnetGameAddress = getGameAddress(mainnetChainId);
  const sepoliaTokenAddress = getTokenAddress(sepoliaChainId);
  const mainnetTokenAddress = getTokenAddress(mainnetChainId);

  // Define game contract methods
  const gameContractMethods = [
    { name: "buy_gamepack", entrypoint: "buy_gamepack" },
    { name: "open_gamepack", entrypoint: "open_gamepack" },
    { name: "start_game", entrypoint: "start_game" },
    { name: "pull_orb", entrypoint: "pull_orb" },
    { name: "cash_out", entrypoint: "cash_out" },
    { name: "enter_shop", entrypoint: "enter_shop" },
    { name: "next_level", entrypoint: "next_level" },
    { name: "next_game", entrypoint: "next_game" },
    { name: "buy_common", entrypoint: "buy_common" },
    { name: "buy_rare", entrypoint: "buy_rare" },
    { name: "buy_cosmic", entrypoint: "buy_cosmic" },
  ];

  // Define token contract methods
  const tokenContractMethods = [
    { name: "approve", entrypoint: "approve" },
  ];

  return {
    contracts: {
      // Sepolia contracts
      [sepoliaGameAddress]: {
        description: "Glitch Bomb Game Contract (Sepolia)",
        methods: gameContractMethods,
      },
      [sepoliaTokenAddress]: {
        description: "Glitch Bomb Token (Sepolia)",
        methods: tokenContractMethods,
      },
      // Mainnet contracts
      [mainnetGameAddress]: {
        description: "Glitch Bomb Game Contract (Mainnet)",
        methods: gameContractMethods,
      },
      [mainnetTokenAddress]: {
        description: "Glitch Bomb Token (Mainnet)",
        methods: tokenContractMethods,
      },
    },
  };
};

const provider = jsonRpcProvider({
  rpc: (chain: Chain) => {
    switch (chain) {
      case mainnet:
        return { nodeUrl: chain.rpcUrls.cartridge.http[0] };
      case sepolia:
        return { nodeUrl: chain.rpcUrls.cartridge.http[0] };
      default:
        throw new Error(`Unsupported chain: ${chain.network}`);
    }
  },
});

const options: ControllerOptions = {
  defaultChainId: DEFAULT_CHAIN_ID,
  chains: buildChains(),
  policies: buildPolicies(),
  preset: "glitch-bomb",
  namespace: "GLITCHBOMB",
  // slot: "glitchbomb-bal",
};

const connectors = [new ControllerConnector(options) as never as Connector];

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <StarknetConfig
        autoConnect
        chains={[chains[DEFAULT_CHAIN_ID]]}
        connectors={connectors}
        explorer={voyager}
        provider={provider}
      >
        <DojoSdkProviderInitialized>
          <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
            <RouterProvider router={router} />
          </TanStackQueryProvider.Provider>
        </DojoSdkProviderInitialized>
      </StarknetConfig>
    </StrictMode>,
  )
}

