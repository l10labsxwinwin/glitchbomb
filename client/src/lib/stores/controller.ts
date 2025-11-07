import { writable } from 'svelte/store';
import Controller from '@cartridge/controller';
import type { AccountInterface } from 'starknet';
import { browser } from '$app/environment';
import { constants } from 'starknet';

export const WORLD_ADDRESS = '0x63d4a0854146d7f6e773b9c38d42156cefc3310524414cc75e61d593792c443';
export const RPC_URL = 'https://api.cartridge.gg/x/starknet/sepolia';
export const CONTRACT_ADDRESS = '0x63c38eb06b1e64df9cec2c8b6c6f4cfa6fe666108bf4f43a09f2aa3823a5318';
export const TOKEN_ADDRESS = '0x6cbcd89a04ef593a554b279fe345ebfb61b246baeee0bf7b834079cca18409e';
export const COLLECTION_ADDRESS = '0x28fd9317324c861364737f8ccabd4e4fd2b2a9174f9a5e972e9c71c2281a6fe';

const controller = new Controller({
	chains: [
		{ rpcUrl: RPC_URL }
	],
	defaultChainId: constants.StarknetChainId.SN_SEPOLIA
});

export const account = writable<AccountInterface | null>(null);
export const username = writable<string | null>(null);
export const isConnected = writable<boolean>(false);

export async function connectController() {
	try {
		const acc = await controller.connect();
		if (!acc) {
			throw new Error('Failed to get account');
		}

		account.set(acc);
		isConnected.set(true);

		const addr = acc.address;
		const user = addr.slice(0, 6) + '...' + addr.slice(-4);
		username.set(user);

		if (browser) {
			localStorage.setItem('wallet_connected', 'true');
			localStorage.setItem('wallet_address', addr);
			localStorage.setItem('wallet_username', user);
		}

		return acc;
	} catch (error) {
		console.error('Failed to connect controller:', error);
		throw error;
	}
}

export async function disconnectController() {
	try {
		await controller.disconnect();
		account.set(null);
		username.set(null);
		isConnected.set(false);

		if (browser) {
			localStorage.removeItem('wallet_connected');
			localStorage.removeItem('wallet_address');
			localStorage.removeItem('wallet_username');
		}
	} catch (error) {
		console.error('Failed to disconnect controller:', error);
	}
}

export async function restoreConnection() {
	if (!browser) return;

	const wasConnected = localStorage.getItem('wallet_connected');
	if (wasConnected === 'true') {
		try {
			const acc = await controller.probe();
			if (acc) {
				account.set(acc);
				isConnected.set(true);

				const storedUsername = localStorage.getItem('wallet_username');
				if (storedUsername) {
					username.set(storedUsername);
				} else {
					const addr = acc.address;
					const user = addr.slice(0, 6) + '...' + addr.slice(-4);
					username.set(user);
					localStorage.setItem('wallet_username', user);
				}
			} else {
				localStorage.removeItem('wallet_connected');
				localStorage.removeItem('wallet_address');
				localStorage.removeItem('wallet_username');
			}
		} catch (error) {
			console.error('Failed to restore connection:', error);
			if (browser) {
				localStorage.removeItem('wallet_connected');
				localStorage.removeItem('wallet_address');
				localStorage.removeItem('wallet_username');
			}
		}
	}
}
