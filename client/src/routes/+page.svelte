<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { isConnected, username, account, connectController, disconnectController, CONTRACT_ADDRESS } from '$lib/stores/controller';
	import { DojoProvider, createDojoConfig } from '@dojoengine/core';
	import { setupWorld } from '$lib/typescript/contracts.gen';
	import manifest from '$lib/manifest_sepolia.json';

	const RPC_URL = 'https://api.cartridge.gg/x/starknet/sepolia';

	let provider: DojoProvider;
	let contracts: ReturnType<typeof setupWorld>;
	let tokenBalance = '0';
	let loadingBalance = false;

	onMount(async () => {
		if (browser) {
			try {
				const dojoConfig = createDojoConfig({ manifest });
				provider = new DojoProvider(dojoConfig.manifest, RPC_URL);
				contracts = setupWorld(provider);
				console.log('Dojo provider initialized with world:', dojoConfig.manifest.world.address);
			} catch (error) {
				console.error('Failed to initialize Dojo provider:', error);
			}
		}
	});

	$: if ($account && contracts) {
		loadTokenBalance();
	}

	async function loadTokenBalance() {
		if (!$account || !contracts || loadingBalance) return;
		
		loadingBalance = true;
		try {
			const balance = await contracts.Token.balanceOf($account.address);
			tokenBalance = (BigInt(balance) / BigInt(10 ** 18)).toString();
		} catch (error) {
			console.error('Failed to load token balance:', error);
			tokenBalance = '0';
		} finally {
			loadingBalance = false;
		}
	}

	async function handleConnect() {
		try {
			await connectController();
		} catch (error) {
			console.error(error);
		}
	}

	async function handleDisconnect() {
		await disconnectController();
	}

	async function callContract(fn: () => Promise<any>, name: string) {
		if (!$account) {
			alert('Please connect wallet first');
			return;
		}

		if (!contracts) {
			alert('Contracts not initialized yet');
			return;
		}
		
		try {
			const result = await fn();
			console.log(`${name} result:`, result);
			alert(`${name} success! Check console for details.`);
		} catch (error) {
			console.error(`${name} error:`, error);
			alert(`${name} failed: ${error}`);
		}
	}

	async function buyGamepack() {
		await callContract(
			() => contracts.gb_contract_v2.buyGamepack($account!),
			'Buy Gamepack'
		);
	}

	async function mintTokens() {
		if (!$account) {
			alert('Please connect wallet first');
			return;
		}
		await callContract(
			async () => {
				const result = await contracts.Token.mint($account!, $account!.address, '1000000000000000000000');
				await loadTokenBalance();
				return result;
			},
			'Mint Tokens'
		);
	}

	async function approveTokens() {
		if (!$account) {
			alert('Please connect wallet first');
			return;
		}
		await callContract(
			async () => {
				const maxApproval = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
				return await contracts.Token.approve($account!, CONTRACT_ADDRESS, maxApproval);
			},
			'Approve Tokens'
		);
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-8 bg-black p-8 text-white">
	<h1 class="text-6xl font-bold uppercase tracking-tight">glitchbomb</h1>
	
	{#if $isConnected}
		<div class="flex flex-col items-center gap-6">
			<div class="flex flex-col items-center gap-2">
				<p class="text-sm">{$username}</p>
				<p class="text-xs text-gray-400">Balance: {tokenBalance} tokens</p>
			</div>
			
			<div class="flex flex-col gap-4 w-full max-w-md">
				<a href="/gamepacks" class="border border-blue-500 px-4 py-2 uppercase text-blue-500 transition-colors hover:bg-blue-500 hover:text-black text-center">
					View Gamepacks
				</a>

				<div class="grid grid-cols-2 gap-2">
					<button onclick={mintTokens} class="border border-green-500 px-4 py-2 uppercase text-green-500 transition-colors hover:bg-green-500 hover:text-black">
						Mint Tokens (1000)
					</button>
					<button onclick={approveTokens} class="border border-yellow-500 px-4 py-2 uppercase text-yellow-500 transition-colors hover:bg-yellow-500 hover:text-black">
						Approve Tokens
					</button>
					<button onclick={buyGamepack} class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black col-span-2">
						Buy Gamepack
					</button>
				</div>
			</div>

			<button
				onclick={handleDisconnect}
				class="border border-red-500 px-6 py-2 uppercase text-red-500 transition-colors hover:bg-red-500 hover:text-white"
			>
				Disconnect
			</button>
		</div>
	{:else}
		<button
			onclick={handleConnect}
			class="border border-white px-6 py-2 uppercase transition-colors hover:bg-white hover:text-black"
		>
			Connect Controller
		</button>
	{/if}
</div>
