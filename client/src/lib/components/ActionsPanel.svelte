<script lang="ts">
	import { account, CONTRACT_ADDRESS } from '$lib/stores/controller';
	import { DojoProvider, createDojoConfig } from '@dojoengine/core';
	import { setupWorld } from '$lib/typescript/contracts.gen';
	import manifest from '$lib/manifest_sepolia.json';

	interface Props {
		gamepackId: string | number;
	}

	let { gamepackId }: Props = $props();

	const RPC_URL = 'https://api.cartridge.gg/x/starknet/sepolia';
	const dojoConfig = createDojoConfig({ manifest });
	const provider = new DojoProvider(dojoConfig.manifest, RPC_URL);
	const contracts = setupWorld(provider);

	let tokenBalance = $state('0');
	let loadingBalance = $state(false);

	$effect(() => {
		if ($account) {
			loadTokenBalance();
		}
	});

	async function loadTokenBalance() {
		if (!$account || loadingBalance) return;
		
		loadingBalance = true;
		try {
			const balance = await contracts.Token.balanceOf($account.address);
			const balanceValue = typeof balance === 'bigint' ? balance : BigInt(balance.toString());
			tokenBalance = (balanceValue / BigInt(10 ** 18)).toString();
		} catch (error) {
			console.error('Failed to load token balance:', error);
			tokenBalance = '0';
		} finally {
			loadingBalance = false;
		}
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

	async function openGamepack() {
		await callContract(
			() => contracts.gb_contract_v2.openGamepack($account!, gamepackId),
			'Open Gamepack'
		);
	}

	async function startGame() {
		await callContract(
			() => contracts.gb_contract_v2.startGame($account!, gamepackId),
			'Start Game'
		);
	}

	async function pullOrb() {
		await callContract(
			() => contracts.gb_contract_v2.pullOrb($account!, gamepackId),
			'Pull Orb'
		);
	}

	async function nextLevel() {
		await callContract(
			() => contracts.gb_contract_v2.nextLevel($account!, gamepackId),
			'Next Level'
		);
	}

	async function enterShop() {
		await callContract(
			() => contracts.gb_contract_v2.enterShop($account!, gamepackId),
			'Enter Shop'
		);
	}

	async function buyCommon() {
		await callContract(
			() => contracts.gb_contract_v2.buyCommon($account!, gamepackId, '0'),
			'Buy Common'
		);
	}

	async function buyRare() {
		await callContract(
			() => contracts.gb_contract_v2.buyRare($account!, gamepackId, '0'),
			'Buy Rare'
		);
	}

	async function buyCosmic() {
		await callContract(
			() => contracts.gb_contract_v2.buyCosmic($account!, gamepackId, '0'),
			'Buy Cosmic'
		);
	}

	async function nextGame() {
		await callContract(
			() => contracts.gb_contract_v2.nextGame($account!, gamepackId),
			'Next Game'
		);
	}

	async function cashOut() {
		await callContract(
			() => contracts.gb_contract_v2.cashOut($account!, gamepackId),
			'Cash Out'
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

<div class="bg-black/30 border border-white p-6 rounded-lg">
	<h2 class="text-2xl font-bold mb-4">Actions</h2>
	
	{#if $account}
		<div class="flex flex-col gap-4">
			<div class="text-sm opacity-60">
				Token Balance: {tokenBalance}
			</div>

			<div class="grid grid-cols-2 gap-2">
				<button onclick={mintTokens} class="border border-green-500 px-4 py-2 uppercase text-green-500 transition-colors hover:bg-green-500 hover:text-black text-sm">
					Mint Tokens (1000)
				</button>
				<button onclick={approveTokens} class="border border-yellow-500 px-4 py-2 uppercase text-yellow-500 transition-colors hover:bg-yellow-500 hover:text-black text-sm">
					Approve Tokens
				</button>
				<button onclick={buyGamepack} class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black col-span-2 text-sm">
					Buy Gamepack
				</button>
				<button onclick={openGamepack} class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-sm">
					Open Gamepack
				</button>
				<button onclick={startGame} class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-sm">
					Start Game
				</button>
				<button onclick={pullOrb} class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-sm">
					Pull Orb
				</button>
				<button onclick={nextLevel} class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-sm">
					Next Level
				</button>
				<button onclick={enterShop} class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-sm">
					Enter Shop
				</button>
				<button onclick={buyCommon} class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-sm">
					Buy Common
				</button>
				<button onclick={buyRare} class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-sm">
					Buy Rare
				</button>
				<button onclick={buyCosmic} class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-sm">
					Buy Cosmic
				</button>
				<button onclick={nextGame} class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-sm">
					Next Game
				</button>
				<button onclick={cashOut} class="border border-white px-4 py-2 uppercase transition-colors hover:bg-white hover:text-black text-sm">
					Cash Out
				</button>
			</div>
		</div>
	{:else}
		<p class="text-sm opacity-60">Connect your wallet to use actions</p>
	{/if}
</div>
