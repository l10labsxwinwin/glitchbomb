import { init } from '@dojoengine/sdk';
import { dojoConfig } from './dojoConfig';
import { setupWorld } from './typescript/contracts.gen';
import type { SchemaType } from './typescript/models.gen';

let sdk: Awaited<ReturnType<typeof init<SchemaType>>> | null = null;
let isLoading = $state(false);
let isInitialized = $state(false);

export async function initDojoSDK() {
	if (sdk) return sdk;
	
	isLoading = true;
	try {
		sdk = await init<SchemaType>({
			client: {
				worldAddress: dojoConfig.manifest.world.address,
				toriiUrl: dojoConfig.toriiUrl || 'http://localhost:8080'
			},
			domain: {
				name: 'GlitchBomb',
				version: '1.0',
				chainId: 'KATANA',
				revision: '1'
			}
		});

		isInitialized = true;
		console.log('Dojo SDK initialized', sdk);
		return sdk;
	} catch (error) {
		console.error('Failed to initialize Dojo SDK:', error);
		isInitialized = false;
		throw error;
	} finally {
		isLoading = false;
	}
}

export function getSDK() {
	return sdk;
}

export function sdkLoading() {
	return isLoading;
}

export function sdkInitialized() {
	return isInitialized;
}
