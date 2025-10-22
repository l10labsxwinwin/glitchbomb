import type { BurnerManager } from '@dojoengine/create-burner';

export function updateBurnerList(burnerManager: BurnerManager | undefined): {
	burners: any[];
	count: number;
} {
	if (!burnerManager) return { burners: [], count: 0 };
	const burners = burnerManager.list();
	return { burners, count: burners.length };
}

export async function createBurner(burnerManager: BurnerManager | undefined): Promise<void> {
	if (!burnerManager) return;
	console.log('Creating new burner...');
	await burnerManager.create();
	console.log('✅ New burner created');
}

export function clearBurners(burnerManager: BurnerManager | undefined): void {
	if (!burnerManager) return;
	if (confirm('Are you sure you want to clear all burners?')) {
		burnerManager.clear();
		console.log('✅ All burners cleared');
	}
}

export async function saveBurners(burnerManager: BurnerManager | undefined): Promise<void> {
	if (!burnerManager) return;
	try {
		await burnerManager.copyBurnersToClipboard();
		alert('Burners saved to clipboard!');
	} catch (err) {
		console.error('Failed to save burners:', err);
	}
}

export async function restoreBurners(burnerManager: BurnerManager | undefined): Promise<void> {
	if (!burnerManager) return;
	try {
		await burnerManager.setBurnersFromClipboard();
		alert('Burners restored from clipboard!');
	} catch (err) {
		console.error('Failed to restore burners:', err);
	}
}
