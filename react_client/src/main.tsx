import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import ControllerConnector from "@cartridge/connector/controller";
import type { ControllerOptions } from "@cartridge/controller";

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import { DojoSdkProviderInitialized } from "./context/dojo";
import { chains, DEFAULT_CHAIN_ID } from "../config";
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
  // policies: buildPolicies(),
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

