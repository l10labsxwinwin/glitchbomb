import { init, KeysClause, type ParsedEntity, type SDK } from '@dojoengine/sdk';
import { ToriiQueryBuilder } from '@dojoengine/sdk';
import { dojoConfig } from './dojoConfig';
import {
	ModelsMapping,
	type Player,
	type GamePack,
	type SchemaType
} from './typescript/models.gen';
import type { Subscription } from '@dojoengine/torii-client';

const dojoState = $state({
	sdk: null as SDK<SchemaType> | null,
	is_sdk_ready: false,

	players: [] as Partial<Player>[],
	gamepacks: [] as Partial<GamePack>[],

	subscriptions: {
		players: null as Subscription | null,
		gamepacks: null as Subscription | null
	}
});

export function get_dojo_state() {
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

export async function subscribe_to_gamepacks(player_id: string) {
	if (!dojoState.sdk) {
		throw new Error('SDK not initialized');
	}

	const [initialEntities, subscription] = await dojoState.sdk.subscribeEntityQuery({
		query: new ToriiQueryBuilder()
			.withEntityModels([ModelsMapping.GamePack])
			.withClause(KeysClause([ModelsMapping.GamePack], [player_id], 'VariableLen').build())
			.includeHashedKeys(),
		callback: ({ data, error }) => {
			if (data) {
				data.forEach((entity) => {
					const gamepack = entity.models.glitchbomb.GamePack;
					if (gamepack) {
						console.log('GamePack updated:', data);
						const existingIndex = dojoState.gamepacks.findIndex(
							(gp) => gp.player_id === gamepack.player_id && gp.gamepack_id === gamepack.gamepack_id
						);
						if (existingIndex !== -1) {
							dojoState.gamepacks[existingIndex] = gamepack;
						} else {
							dojoState.gamepacks.push(gamepack);
						}
					}
				});
			}
			if (error) {
				console.error('Subscription error:', error);
			}
		}
	});

	console.log('initial gamepacks:');
	initialEntities.getItems().forEach((entity: ParsedEntity<SchemaType>) => {
		console.log(entity);
		const gamepack = entity.models.glitchbomb.GamePack;
		if (gamepack) {
			dojoState.gamepacks.push(gamepack);
		}
	});

	dojoState.subscriptions.gamepacks = subscription;
}

export function cleanup_gamepacks_subscription() {
	if (dojoState.subscriptions.gamepacks) {
		dojoState.subscriptions.gamepacks.cancel();
		dojoState.subscriptions.gamepacks = null;
	}
}
