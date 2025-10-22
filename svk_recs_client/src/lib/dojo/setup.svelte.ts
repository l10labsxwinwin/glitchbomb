import { init, type ParsedEntity, type SDK } from '@dojoengine/sdk';
import { ToriiQueryBuilder } from '@dojoengine/sdk';
import { dojoConfig } from './dojoConfig';
import { ModelsMapping, type Player, type SchemaType } from './typescript/models.gen';
import type { Subscription } from '@dojoengine/torii-client';

export const dojoState = $state({
	sdk: null as SDK<SchemaType> | null,
	is_sdk_ready: false,

	players: [] as Partial<Player>[],

	subscriptions: {
		players: null as Subscription | null
	}
});

export function get_sdk() {
	return dojoState;
}

export async function init_sdk() {
	try {
		dojoState.sdk = await init({
			client: {
				toriiUrl: dojoConfig.toriiUrl,
				worldAddress: dojoConfig.manifest.world.address
			},
			domain: {
				name: 'glitchbomb',
				version: '0.1.0',
				chainId: 'KATANA',
				revision: '1'
			}
		});

		dojoState.is_sdk_ready = true;
		console.log('dojo sdk is ready');
	} catch (error) {
		dojoState.is_sdk_ready = false;
		console.log(error);
	}
}

export async function subscribe_to_players() {
	if (!dojoState.sdk) {
		throw new Error('SDK not initialized');
	}

	const [initialEntities, subscription] = await dojoState.sdk.subscribeEntityQuery({
		query: new ToriiQueryBuilder().withEntityModels([ModelsMapping.Player]).includeHashedKeys(),
		callback: ({ data, error }) => {
			if (data) {
				data.forEach((entity) => {
					const player = entity.models.glitchbomb.Player;
					if (player) {
						console.log('Player updated:', data);
						const existingIndex = dojoState.players.findIndex(
							(p) => p.player_id === player.player_id
						);
						if (existingIndex !== -1) {
							dojoState.players[existingIndex] = player;
						} else {
							dojoState.players.push(player);
						}
					}
				});
			}
			if (error) {
				console.error('Subscription error:', error);
			}
		}
	});

	console.log('initial players:');
	initialEntities.getItems().forEach((entity: ParsedEntity<SchemaType>) => {
		console.log(entity);
		const player = entity.models.glitchbomb.Player;
		if (player) {
			dojoState.players.push(player);
		}
	});

	dojoState.subscriptions.players = subscription;
}

export function cleanup_players_subscription() {
	if (dojoState.subscriptions.players) {
		dojoState.subscriptions.players.cancel();
		dojoState.subscriptions.players = null;
	}
}
