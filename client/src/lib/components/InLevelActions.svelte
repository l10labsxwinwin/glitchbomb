<script lang="ts">
	interface Props {
		onPullOrb: () => Promise<void>;
		onCashOut: () => Promise<void>;
		onEnterShop: () => Promise<void>;
		pullingOrb: boolean;
		cashingOut: boolean;
		enteringShop: boolean;
	}

	let { onPullOrb, onCashOut, onEnterShop, pullingOrb, cashingOut, enteringShop }: Props = $props();
</script>

<div>
	<h2 class="text-2xl font-bold mb-4">Actions</h2>
	<div class="bg-black/30 border border-white p-4 rounded-lg">
		<div class="flex gap-4 justify-center">
			<button
				onclick={onPullOrb}
				disabled={pullingOrb}
				class="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer rounded-lg font-bold"
			>
				{pullingOrb ? 'Pulling...' : 'Pull Orb'}
			</button>
			<button
				onclick={onCashOut}
				disabled={cashingOut}
				class="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer rounded-lg font-bold"
			>
				{cashingOut ? 'Cashing Out...' : 'Cash Out'}
			</button>
			<button
				onclick={onEnterShop}
				disabled={enteringShop}
				class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer rounded-lg font-bold"
			>
				{enteringShop ? 'Entering...' : 'Enter Shop'}
			</button>
		</div>
	</div>
</div>
