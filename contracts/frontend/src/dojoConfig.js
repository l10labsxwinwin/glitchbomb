/**
 * Dojo Configuration
 *
 * Contains configuration for connecting to Dojo world and Torii
 */

// Import manifest from root directory
import manifest from '../../manifest_dev.json' assert { type: 'json' };

// Namespace for all models
export const NAMESPACE = 'glitchbomb';

// Model names
export const MODELS = {
  PLAYER: 'Player',
  GAME_PACK: 'GamePack',
  GAME: 'Game',
  ORBS_IN_GAME: 'OrbsInGame',
};

// Torii and world connection settings
export const TORII_URL = 'http://localhost:8080';
export const RPC_URL = 'http://localhost:5050';

// Domain separator for signing
export const DOMAIN_SEPARATOR = {
  name: 'glitchbomb',
  version: '1.0',
  chainId: 'KATANA',
  revision: '1',
};

// Cartridge Controller options
export const controllerOpts = {
  chains: [{ rpcUrl: RPC_URL }],
  // "KATANA" chain ID
  defaultChainId: '0x4b4154414e41',
  policies: {
    contracts: {
      [manifest.contracts[0].address]: {
        name: 'GlitchBomb V2',
        description: 'GlitchBomb game contract',
        methods: manifest.contracts[0].systems.map(system => ({
          name: system,
          entrypoint: system,
          description: `Execute ${system}`,
        })),
      },
    },
  },
};

export { manifest };
