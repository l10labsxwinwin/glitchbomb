/**
 * Main application entry point
 *
 * Auto-loads and displays Dojo model data for test address using Torii subscriptions
 */

import './style.css';
import { init, ToriiQueryBuilder, KeysClause } from '@dojoengine/sdk';

import {
  manifest,
  NAMESPACE,
  MODELS,
  DOMAIN_SEPARATOR,
  TORII_URL,
} from './dojoConfig.js';
import { updateFromEntitiesData, clearDisplays } from './modelDisplay.js';

// Global subscription reference
let subscription = null;

// Test address to display data for
const TEST_ADDRESS = '0x127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec';

/**
 * Initialize Torii and set up subscriptions for test address
 */
async function initializeTorii() {
  try {
    updateConnectionStatus('Connecting to Torii...', false);

    // Initialize Torii client
    const torii = await init({
      client: {
        worldAddress: manifest.world.address,
        toriiUrl: TORII_URL,
      },
      domain: DOMAIN_SEPARATOR,
    });

    console.log('Torii initialized successfully');

    // Build model keys for subscription
    // Format: namespace-ModelName (e.g., 'glitchbomb-Player')
    const modelKeys = [
      `${NAMESPACE}-${MODELS.PLAYER}`,
      `${NAMESPACE}-${MODELS.GAME_PACK}`,
      `${NAMESPACE}-${MODELS.GAME}`,
      `${NAMESPACE}-${MODELS.ORBS_IN_GAME}`,
    ];

    console.log('Subscribing to models:', modelKeys);
    console.log('For test address:', TEST_ADDRESS);

    updateConnectionStatus('Subscribing to models...', false);

    // Subscribe to model updates for the test address
    // Using KeysClause to filter by test address
    const [_, sub] = await torii.subscribeEntityQuery({
      query: new ToriiQueryBuilder().withClause(
        KeysClause(modelKeys, [TEST_ADDRESS], 'FixedLen').build(),
      ),
      callback: ({ data, error }) => {
        if (error) {
          console.error('Subscription error:', error);
          updateConnectionStatus('Subscription error: ' + error.message, false);
          return;
        }

        if (data) {
          console.log('Received entity update:', data);
          updateFromEntitiesData(data);
        }
      },
    });

    subscription = sub;
    console.log('Subscription active - listening for updates');
    updateConnectionStatus(`Watching: ${TEST_ADDRESS.slice(0, 6)}...${TEST_ADDRESS.slice(-4)}`, true);

    // Clean up subscription on window close
    window.addEventListener('beforeunload', () => {
      if (subscription) {
        subscription.cancel();
      }
    });

    return torii;
  } catch (error) {
    console.error('Failed to initialize Torii:', error);
    updateConnectionStatus('Failed to connect: ' + error.message, false);
    clearDisplays();
    throw error;
  }
}

/**
 * Update connection status display
 */
function updateConnectionStatus(message, isConnected) {
  const statusEl = document.getElementById('connection-status');
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = isConnected ? 'status connected' : 'status disconnected';
  }
}

/**
 * Initialize the application
 */
async function init_app() {
  console.log('GlitchBomb V2 Model Viewer initialized');
  console.log('Manifest:', manifest);

  // Log configuration
  console.log('Configuration:');
  console.log('- World Address:', manifest.world.address);
  console.log('- Torii URL:', TORII_URL);
  console.log('- Namespace:', NAMESPACE);
  console.log('- Models:', Object.values(MODELS));
  console.log('- Test Address:', TEST_ADDRESS);

  // Auto-initialize Torii and start watching for data
  try {
    await initializeTorii();
  } catch (error) {
    console.error('Failed to auto-initialize:', error);
  }
}

// Initialize on page load
init_app();
