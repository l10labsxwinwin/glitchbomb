import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);
	let id = 0;

	return {
		subscribe,
		add: (message: string, type: ToastType = 'info', duration = 5000) => {
			const toast: Toast = { id: id++, message, type };
			update((toasts) => [...toasts, toast]);

			setTimeout(() => {
				update((toasts) => toasts.filter((t) => t.id !== toast.id));
			}, duration);
		},
		remove: (id: number) => {
			update((toasts) => toasts.filter((t) => t.id !== id));
		}
	};
}

export const toasts = createToastStore();
