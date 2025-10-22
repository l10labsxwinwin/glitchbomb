import { writable } from 'svelte/store';
import type { BurnerManager } from '@dojoengine/create-burner';
import type { Account } from 'starknet';
import type { DojoProvider } from '@dojoengine/core';

export const burnerManager = writable<BurnerManager | undefined>(undefined);
export const account = writable<Account | undefined>(undefined);
export const dojoProvider = writable<DojoProvider | undefined>(undefined);
