import { init, ToriiQueryBuilder, KeysClause } from '@dojoengine/sdk';
import { dojoConfig } from './dojoConfig';
import { setupWorld } from './typescript/contracts.gen';
import { ModelsMapping, type SchemaType } from './typescript/models.gen';

let sdk: Awaited<ReturnType<typeof init<SchemaType>>> | null = null;
let subscription = null;
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

export async function subscribeToGamePacks() {
	if (!sdk) {
		throw new Error('SDK not initialized');
	}

	if (subscription) {
		subscription.cancel();
	}

	const [initialEntities, sub] = await sdk.subscribeEntityQuery({
		query: new ToriiQueryBuilder()
			.withClause(KeysClause([ModelsMapping.GamePack], [], 'VariableLen').build())
			.includeHashedKeys(),
		callback: ({ data, error }) => {
			if (data) {
				console.log('GamePack entities updated:', data);
				data.forEach((entity) => {
					const gamePack = entity.models.glitchbomb.GamePack;
					if (gamePack) {
						console.log(`GamePack ${gamePack.gamepack_id}:`, gamePack);
					}
				});
			}
			if (error) {
				console.error('GamePack subscription error:', error);
			}
		}
	});

	subscription = sub;
	console.log('Subscribed to GamePack entities, initial:', initialEntities);
	return { initialEntities, subscription: sub };
}

export function cancelSubscription() {
	if (subscription) {
		subscription.cancel();
		subscription = null;
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
