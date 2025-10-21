import { setup, type SetupResult } from '../../dojo';
import { dojoConfig } from '$lib/dojoConfig';

let dojoContext = $state<SetupResult | null>(null);
let isInitialized = $state(false);
let isLoading = $state(false);
let error = $state<Error | null>(null);

export const dojoStore = {
	get context() {
		return dojoContext;
	},
	get isInitialized() {
		return isInitialized;
	},
	get isLoading() {
		return isLoading;
	},
	get error() {
		return error;
	},
	async initialize() {
		if (isInitialized || isLoading) return;

		isLoading = true;
		error = null;

		try {
			dojoContext = await setup(dojoConfig);
			isInitialized = true;
		} catch (e) {
			error = e instanceof Error ? e : new Error('Failed to initialize Dojo');
			console.error('Failed to initialize Dojo:', e);
		} finally {
			isLoading = false;
		}
	}
};
