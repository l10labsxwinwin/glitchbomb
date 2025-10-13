/**
 * Main application entry point
 *
 * Handles Cartridge Controller connection and Torii subscriptions
 */

import './style.css';
import Controller from '@cartridge/controller';
import { init, ToriiQueryBuilder, KeysClause } from '@dojoengine/sdk';

import {
  manifest,
  NAMESPACE,
  MODELS,
  DOMAIN_SEPARATOR,
  TORII_URL,
  controllerOpts,
} from './dojoConfig.js';
import { updateFromEntitiesData, clearDisplays } from './modelDisplay.js';

// Global references
let subscription = null;
let controller = null;

/**
 * Initialize Torii and set up subscriptions
 */
async function initializeTorii(account) {
  try {
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
    console.log('For account:', account.address);

    // Subscribe to model updates for the connected account
    // Using KeysClause to filter by account address
    const [_, sub] = await torii.subscribeEntityQuery({
      query: new ToriiQueryBuilder()
        .withClause(KeysClause(modelKeys, [account.address], 'FixedLen').build())
        .build(),
      callback: ({ data, error }) => {
        if (error) {
          console.error('Subscription error:', error);
          return;
        }

        if (data) {
          console.log('Received entity update:', data);
          updateFromEntitiesData(data);
        }
      },
    });

    subscription = sub;
    console.log('Subscription active');

    // Clean up subscription on window close
    window.addEventListener('beforeunload', () => {
      if (subscription) {
        subscription.cancel();
      }
    });

    return torii;
  } catch (error) {
    console.error('Failed to initialize Torii:', error);
    updateConnectionStatus('Error: ' + error.message, false);
    throw error;
  }
}

/**
 * Update connection status display
 */
function updateConnectionStatus(message, isConnected) {
  const statusEl = document.getElementById('connection-status');
  statusEl.textContent = message;
  statusEl.className = isConnected ? 'status connected' : 'status disconnected';
}

/**
 * Handle wallet connection
 */
async function handleConnect() {
  const button = document.getElementById('connect-button');
  button.disabled = true;
  button.textContent = 'Connecting...';

  try {
    // Check if controller is initialized
    if (!controller) {
      throw new Error('Controller not initialized. Please wait and try again.');
    }

    // Connect to wallet
    const account = await controller.connect();

    if (!account || !account.address) {
      throw new Error('Failed to get account information');
    }

    console.log('Connected with account:', account.address);
    updateConnectionStatus(`Connected: ${account.address.slice(0, 6)}...${account.address.slice(-4)}`, true);

    button.textContent = 'Connected';
    button.style.backgroundColor = '#4CAF50';

    // Initialize Torii with the connected account
    await initializeTorii(account);

  } catch (error) {
    console.error('Connection failed:', error);
    updateConnectionStatus('Connection failed: ' + error.message, false);
    button.disabled = false;
    button.textContent = 'Connect Wallet';
    button.style.backgroundColor = '';

    // Clear displays on error
    clearDisplays();
  }
}

/**
 * Initialize the application
 */
async function init_app() {
  console.log('GlitchBomb V2 Model Viewer initialized');
  console.log('Manifest:', manifest);

  // Initialize Cartridge Controller
  try {
    console.log('Initializing Cartridge Controller...');
    controller = new Controller(controllerOpts);
    console.log('Controller initialized successfully');
  } catch (error) {
    console.error('Failed to initialize controller:', error);
  }

  // Set up connect button handler
  const connectButton = document.getElementById('connect-button');
  connectButton.onclick = handleConnect;

  // Enable button after a short delay to ensure controller is ready
  setTimeout(() => {
    connectButton.disabled = false;
    connectButton.textContent = 'Connect Wallet';
    updateConnectionStatus('Disconnected', false);
  }, 500);

  // Log configuration
  console.log('Configuration:');
  console.log('- World Address:', manifest.world.address);
  console.log('- Torii URL:', TORII_URL);
  console.log('- Namespace:', NAMESPACE);
  console.log('- Models:', Object.values(MODELS));
}

// Initialize on page load
init_app();
