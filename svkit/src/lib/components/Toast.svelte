<script lang="ts">
	import { toasts } from '$lib/stores/toast';
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
	{#each $toasts as toast (toast.id)}
		<div
			class="pointer-events-auto px-4 py-3 rounded-lg shadow-lg border animate-slide-in-right flex items-center gap-2 min-w-[300px]"
			class:bg-green-900={toast.type === 'success'}
			class:border-green-600={toast.type === 'success'}
			class:bg-red-900={toast.type === 'error'}
			class:border-red-600={toast.type === 'error'}
			class:bg-blue-900={toast.type === 'info'}
			class:border-blue-600={toast.type === 'info'}
		>
			<div class="flex-1">
				<p class="text-sm">{toast.message}</p>
			</div>
			<button
				onclick={() => toasts.remove(toast.id)}
				class="text-white/60 hover:text-white text-lg leading-none"
			>
				×
			</button>
		</div>
	{/each}
</div>

<style>
	@keyframes slide-in-right {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.animate-slide-in-right {
		animation: slide-in-right 0.3s ease-out;
	}
</style>
