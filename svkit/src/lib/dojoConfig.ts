import { createDojoConfig } from '@dojoengine/core';
import manifest from './manifest_dev.json';

export const dojoConfig = createDojoConfig({
	manifest,
	rpcUrl: 'https://api.cartridge.gg/x/glitchbomb-dev/katana',
	toriiUrl: 'https://api.cartridge.gg/x/glitchbomb-dev/torii'
});

export type DojoConfig = typeof dojoConfig;
