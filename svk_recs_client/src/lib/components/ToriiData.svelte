<script lang="ts">
	import { dojoStore } from '$lib/stores/dojo.svelte';
	import { getComponentValue, runQuery, Has } from '@dojoengine/recs';

	let games = $derived.by(() => {
		if (!dojoStore.context) return [];
		const { clientComponents } = dojoStore.context;
		const entities = runQuery([Has(clientComponents.Game)]);
		return Array.from(entities).map((entityId) => ({
			entityId,
			data: getComponentValue(clientComponents.Game, entityId)
		}));
	});

	let gamePacks = $derived.by(() => {
		if (!dojoStore.context) return [];
		const { clientComponents } = dojoStore.context;
		const entities = runQuery([Has(clientComponents.GamePack)]);
		return Array.from(entities).map((entityId) => ({
			entityId,
			data: getComponentValue(clientComponents.GamePack, entityId)
		}));
	});

	let players = $derived.by(() => {
		if (!dojoStore.context) return [];
		const { clientComponents } = dojoStore.context;
		const entities = runQuery([Has(clientComponents.Player)]);
		return Array.from(entities).map((entityId) => ({
			entityId,
			data: getComponentValue(clientComponents.Player, entityId)
		}));
	});

	let orbsInGame = $derived.by(() => {
		if (!dojoStore.context) return [];
		const { clientComponents } = dojoStore.context;
		const entities = runQuery([Has(clientComponents.OrbsInGame)]);
		return Array.from(entities).map((entityId) => ({
			entityId,
			data: getComponentValue(clientComponents.OrbsInGame, entityId)
		}));
	});
</script>

<div class="p-6 space-y-8">
	<h1 class="text-3xl font-bold mb-6">Torii Data Explorer</h1>

	{#if dojoStore.isLoading}
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
			<p class="text-blue-800">Loading Dojo setup...</p>
		</div>
	{:else if dojoStore.error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4">
			<p class="text-red-800">Error: {dojoStore.error.message}</p>
		</div>
	{:else if !dojoStore.isInitialized}
		<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
			<p class="text-yellow-800">Dojo not initialized</p>
		</div>
	{:else}
		<div class="grid gap-6">
			<section class="bg-white rounded-lg border border-gray-200 p-6">
				<h2 class="text-2xl font-semibold mb-4">Players ({players.length})</h2>
				{#if players.length === 0}
					<p class="text-gray-500 italic">No players found</p>
				{:else}
					<div class="space-y-4">
						{#each players as { entityId, data }}
							<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
								<div class="text-xs text-gray-500 font-mono mb-2">Entity: {entityId}</div>
								<div class="grid grid-cols-2 gap-2">
									<div>
										<span class="font-semibold">Player ID:</span>
										<span class="font-mono text-sm ml-2">{data?.player_id || 'N/A'}</span>
									</div>
									<div>
										<span class="font-semibold">State:</span>
										<span class="ml-2">{data?.state || 'N/A'}</span>
									</div>
									<div>
										<span class="font-semibold">USDC:</span>
										<span class="ml-2">{data?.usdc?.toString() || '0'}</span>
									</div>
									<div>
										<span class="font-semibold">GamePacks Bought:</span>
										<span class="ml-2">{data?.gamepacks_bought?.toString() || '0'}</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<section class="bg-white rounded-lg border border-gray-200 p-6">
				<h2 class="text-2xl font-semibold mb-4">Game Packs ({gamePacks.length})</h2>
				{#if gamePacks.length === 0}
					<p class="text-gray-500 italic">No game packs found</p>
				{:else}
					<div class="space-y-4">
						{#each gamePacks as { entityId, data }}
							<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
								<div class="text-xs text-gray-500 font-mono mb-2">Entity: {entityId}</div>
								<div class="grid grid-cols-2 gap-2">
									<div>
										<span class="font-semibold">Player ID:</span>
										<span class="font-mono text-sm ml-2">{data?.player_id || 'N/A'}</span>
									</div>
									<div>
										<span class="font-semibold">GamePack ID:</span>
										<span class="ml-2">{data?.gamepack_id?.toString() || 'N/A'}</span>
									</div>
									<div>
										<span class="font-semibold">State:</span>
										<span class="ml-2">{data?.state || 'N/A'}</span>
									</div>
									<div>
										<span class="font-semibold">Current Game ID:</span>
										<span class="ml-2">{data?.current_game_id?.toString() || '0'}</span>
									</div>
									<div class="col-span-2">
										<span class="font-semibold">Accumulated Moonrocks:</span>
										<span class="ml-2">{data?.accumulated_moonrocks?.toString() || '0'}</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<section class="bg-white rounded-lg border border-gray-200 p-6">
				<h2 class="text-2xl font-semibold mb-4">Games ({games.length})</h2>
				{#if games.length === 0}
					<p class="text-gray-500 italic">No games found</p>
				{:else}
					<div class="space-y-4">
						{#each games as { entityId, data }}
							<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
								<div class="text-xs text-gray-500 font-mono mb-2">Entity: {entityId}</div>
								<div class="grid grid-cols-3 gap-2">
									<div>
										<span class="font-semibold">Player ID:</span>
										<span class="font-mono text-sm ml-2">{data?.player_id || 'N/A'}</span>
									</div>
									<div>
										<span class="font-semibold">GamePack ID:</span>
										<span class="ml-2">{data?.gamepack_id?.toString() || 'N/A'}</span>
									</div>
									<div>
										<span class="font-semibold">Game ID:</span>
										<span class="ml-2">{data?.game_id?.toString() || 'N/A'}</span>
									</div>
									<div>
										<span class="font-semibold">State:</span>
										<span class="ml-2">{data?.state || 'N/A'}</span>
									</div>
									<div>
										<span class="font-semibold">Level:</span>
										<span class="ml-2">{data?.level?.toString() || '0'}</span>
									</div>
									<div>
										<span class="font-semibold">HP:</span>
										<span class="ml-2">{data?.hp?.toString() || '0'}</span>
									</div>
									<div>
										<span class="font-semibold">Points:</span>
										<span class="ml-2">{data?.points?.toString() || '0'}</span>
									</div>
									<div>
										<span class="font-semibold">Multiplier:</span>
										<span class="ml-2">{data?.multiplier?.toString() || '0'}</span>
									</div>
									<div>
										<span class="font-semibold">Pull #:</span>
										<span class="ml-2">{data?.pull_number?.toString() || '0'}</span>
									</div>
									<div>
										<span class="font-semibold">Glitch Chips:</span>
										<span class="ml-2">{data?.glitch_chips?.toString() || '0'}</span>
									</div>
									<div>
										<span class="font-semibold">Moonrocks Earned:</span>
										<span class="ml-2">{data?.moonrocks_earned?.toString() || '0'}</span>
									</div>
									<div>
										<span class="font-semibold">Moonrocks Spent:</span>
										<span class="ml-2">{data?.moonrocks_spent?.toString() || '0'}</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<section class="bg-white rounded-lg border border-gray-200 p-6">
				<h2 class="text-2xl font-semibold mb-4">Orbs In Game ({orbsInGame.length})</h2>
				{#if orbsInGame.length === 0}
					<p class="text-gray-500 italic">No orbs found</p>
				{:else}
					<div class="space-y-4">
						{#each orbsInGame as { entityId, data }}
							<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
								<div class="text-xs text-gray-500 font-mono mb-2">Entity: {entityId}</div>
								<div class="grid grid-cols-3 gap-2">
									<div>
										<span class="font-semibold">Player ID:</span>
										<span class="font-mono text-sm ml-2">{data?.player_id || 'N/A'}</span>
									</div>
									<div>
										<span class="font-semibold">GamePack ID:</span>
										<span class="ml-2">{data?.gamepack_id?.toString() || 'N/A'}</span>
									</div>
									<div>
										<span class="font-semibold">Game ID:</span>
										<span class="ml-2">{data?.game_id?.toString() || 'N/A'}</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>
		</div>
	{/if}
</div>
