import { ToriiQueryBuilder, KeysClause } from '@dojoengine/sdk';
import { getSDK, extractGamePacks, updateGamePacksList } from './torii_global.svelte';
import { ModelsMapping, type GamePack } from './typescript/models.gen';
import type { Subscription } from '@dojoengine/torii-client';

export async function initializePlayerGamePackSubscription(
	playerId: string,
	onGamePacksUpdate: (gamePacks: GamePack[]) => void
): Promise<Subscription | null> {
	const sdk = getSDK();
	if (!sdk) {
		console.error('SDK not initialized');
		return null;
	}

	const [initialEntities, sub] = await sdk.subscribeEntityQuery({
		query: buildPlayerGamePackQuery(playerId),
		callback: (updateData) => handleGamePackUpdate(updateData, onGamePacksUpdate)
	});

	const initialGamePacks = extractGamePacks(initialEntities);
	onGamePacksUpdate(initialGamePacks);

	return sub;
}

export function buildPlayerGamePackQuery(playerId: string) {
	return new ToriiQueryBuilder()
		.withClause(KeysClause([ModelsMapping.GamePack], [playerId], 'VariableLen').build())
		.includeHashedKeys();
}

export function handleGamePackUpdate(
	{ data, error }: { data?: any; error?: any },
	onGamePacksUpdate: (gamePacks: GamePack[]) => void
) {
	if (data) {
		let updatedPacks: GamePack[] = [];
		data.forEach((entity: any) => {
			const gamePack = entity.models.glitchbomb.GamePack as GamePack;
			if (gamePack && gamePack.player_id) {
				updatedPacks = updateGamePacksList(updatedPacks, gamePack);
			}
		});
		if (updatedPacks.length > 0) {
			onGamePacksUpdate(updatedPacks);
		}
	}
	if (error) {
		console.error('GamePack subscription error:', error);
	}
}

export function cleanupSubscription(subscription: Subscription | null) {
	if (subscription) {
		subscription.cancel();
	}
}

export function getStateString(stateValue: any): string {
	if (typeof stateValue === 'string') {
		return stateValue;
	}
	return Object.keys(stateValue.variant)[0];
}
