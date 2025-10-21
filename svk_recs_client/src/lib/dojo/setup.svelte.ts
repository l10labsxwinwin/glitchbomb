import { init, type SDK } from '@dojoengine/sdk';
import { dojoConfig } from './dojoConfig';
import type { SchemaType } from './typescript/models.gen';

export const dojoState = $state({
	sdk: null as SDK<SchemaType> | null,
	is_sdk_ready: false
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
