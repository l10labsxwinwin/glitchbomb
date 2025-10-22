import { DojoProvider } from '@dojoengine/core';
import { BurnerManager } from '@dojoengine/create-burner';
import { Account, RpcProvider } from 'starknet';
import type { DojoConfig } from '../dojoConfig';

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup(config: DojoConfig) {
	const rpcProvider = new RpcProvider({
		nodeUrl: config.rpcUrl
	});

	const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);

	let burnerManager: BurnerManager;
	try {
		burnerManager = new BurnerManager({
			masterAccount: new Account({
				provider: rpcProvider,
				address: config.masterAddress,
				signer: config.masterPrivateKey
			}),
			feeTokenAddress: config.feeTokenAddress,
			accountClassHash: config.accountClassHash,
			rpcProvider
		});
	} catch (e) {
		console.log('Failed to create burner manager:', e);
		throw e;
	}

	try {
		await burnerManager.init();
		if (burnerManager.list().length === 0) {
			await burnerManager.create();
		}
	} catch (e) {
		console.error('Failed to initialize burner:', e);
	}

	const account = burnerManager.getActiveAccount();
	if (account === null || account === undefined) {
		throw new Error('Failed to get active burner account');
	}

	return {
		dojoProvider,
		burnerManager,
		account,
		rpcProvider,
		config
	};
}
