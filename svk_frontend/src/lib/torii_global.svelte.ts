import { init, ToriiQueryBuilder, KeysClause, MemberClause } from '@dojoengine/sdk';
import { dojoConfig } from './dojoConfig';
// import { setupWorld } from './typescript/contracts.gen';
import { ModelsMapping, type SchemaType, type GamePack } from './typescript/models.gen';
import { Subscription } from '@dojoengine/torii-client';
import { getModelByEntityId } from '@dojoengine/sdk/node';

let sdk: Awaited<ReturnType<typeof init<SchemaType>>> | null = null;
let subscription: null | Subscription = null;

const toriiStateRune = $state({
	isLoading: false,
	isInitialized: false,
	gamePacks: [] as GamePack[]
});

export function getToriiState() {
	return toriiStateRune;
}

export async function initDojoSDK() {
	if (sdk) return sdk;

	toriiStateRune.isLoading = true;
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

		toriiStateRune.isInitialized = true;
		console.log('Dojo SDK initialized', sdk);
		return sdk;
	} catch (error) {
		console.error('Failed to initialize Dojo SDK:', error);
		toriiStateRune.isInitialized = false;
		throw error;
	} finally {
		toriiStateRune.isLoading = false;
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
			// .withClause(MemberClause(ModelsMapping.GamePack, 'gamepack_id', 'Gte', '0').build())
			.includeHashedKeys(),
		callback: ({ data, error }) => {
			if (data) {
				console.log('GamePack entities updated:', data);
				data.forEach((entity) => {
					const gamePack = entity.models.glitchbomb.GamePack;
					if (gamePack) {
						console.log(`GamePack ${gamePack.gamepack_id}:`, gamePack);
						toriiStateRune.gamePacks = updateGamePacksList(toriiStateRune.gamePacks, gamePack);
					}
				});
			}
			if (error) {
				console.error('GamePack subscription error:', error);
			}
		}
	});

	subscription = sub;

	const initialGamePacks = extractGamePacks(initialEntities);
	toriiStateRune.gamePacks = initialGamePacks;

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
	return toriiStateRune.isLoading;
}

export function sdkInitialized() {
	return toriiStateRune.isInitialized;
}

export function extractGamePacks(init_entities: any): GamePack[] {
	const gamePacks: GamePack[] = [];

	if (!init_entities?.items) {
		return gamePacks;
	}

	init_entities.items.forEach((entity: any) => {
		const gamePack = entity?.models?.glitchbomb?.GamePack;
		if (gamePack) {
			gamePacks.push(gamePack);
		}
	});

	return gamePacks;
}

export function updateGamePacksList(
	existingGamePacks: GamePack[],
	newGamePack: GamePack
): GamePack[] {
	const updatedList = [...existingGamePacks];

	const existingIndex = updatedList.findIndex(
		(pack) =>
			pack.player_id === newGamePack.player_id &&
			pack.gamepack_id.toString() === newGamePack.gamepack_id.toString()
	);

	if (existingIndex !== -1) {
		updatedList[existingIndex] = newGamePack;
	} else {
		updatedList.push(newGamePack);
	}

	return updatedList;
}
