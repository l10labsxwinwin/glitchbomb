import { createDojoConfig } from '@dojoengine/core';
import manifest from './manifest_dev.json';

export const dojoConfig = createDojoConfig({
	manifest
});

export type DojoConfig = typeof dojoConfig;
