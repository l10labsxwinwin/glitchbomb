Based on the analysis, example-vanillajs-phaser-recs is the simplest
framework-agnostic burner wallet example. Let me break down how to
set up a burner wallet in a brand new vanilla TypeScript project.

# Setting Up a Burner Wallet in a New Vanilla TypeScript Project

## Step 1: Initialize Project

mkdir my-dojo-app
cd my-dojo-app
npm init -y

## Step 2: Install Dependencies

npm install @dojoengine/core @dojoengine/create-burner starknet
npm install -D typescript vite

## Step 3: Project Structure

my-dojo-app/
├── src/
│   ├── dojo/
│   │   └── setup.ts
│   ├── main.ts
│   └── dojoConfig.ts
├── manifest_dev.json      # Your Dojo world manifest
├── package.json
├── tsconfig.json
└── index.html

## Step 4: Create dojoConfig.ts

// src/dojoConfig.ts
import { createDojoConfig } from "@dojoengine/core";
import manifest from "../manifest_dev.json";

export const dojoConfig = createDojoConfig({
    manifest,
    // Optional: override defaults
    // rpcUrl: "http://127.0.0.1:5050",
    // toriiUrl: "http://127.0.0.1:8080",
    // masterAddress: "0x...",
    // masterPrivateKey: "0x...",
});

export type DojoConfig = typeof dojoConfig;

## Step 5: Create Burner Setup (src/dojo/setup.ts)

This is the core burner wallet setup, extracted from the vanilla
example:

// src/dojo/setup.ts
import { DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { Account, RpcProvider } from "starknet";
import { DojoConfig } from "../dojoConfig";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup(config: DojoConfig) {
    // 1. Create RPC Provider
    const rpcProvider = new RpcProvider({
        nodeUrl: config.rpcUrl,
    });

    // 2. Create DojoProvider for contract interactions
    const dojoProvider = new DojoProvider(config.manifest, config.
rpcUrl);

    // 3. Initialize BurnerManager
    let burnerManager: BurnerManager;
    try {
        burnerManager = new BurnerManager({
            masterAccount: new Account({
                provider: rpcProvider,
                address: config.masterAddress,
                signer: config.masterPrivateKey,
            }),
            feeTokenAddress: config.feeTokenAddress,
            accountClassHash: config.accountClassHash,
            rpcProvider,
        });
    } catch (e) {
        console.log("Failed to create burner manager:", e);
        throw e;
    }

    // 4. Initialize burner manager and create first burner if
needed
    try {
        await burnerManager.init();
        if (burnerManager.list().length === 0) {
            await burnerManager.create();
        }
    } catch (e) {
        console.error("Failed to initialize burner:", e);
    }

    // 5. Get the active burner account
    const account = burnerManager.getActiveAccount();
    if (account === null || account === undefined) {
        throw new Error("Failed to get active burner account");
    }

    // 6. Return everything you need
    return {
        dojoProvider,
        burnerManager,
        account,
        rpcProvider,
        config,
    };
}

## Step 6: Create Main Entry Point (src/main.ts)

// src/main.ts
import { dojoConfig } from "./dojoConfig";
import { setup } from "./dojo/setup";

async function main() {
    console.log("Initializing Dojo app...");

    // Setup burner wallet and Dojo provider
    const {
        burnerManager,
        account,
        dojoProvider,
    } = await setup(dojoConfig);

    console.log("✅ Burner wallet initialized");
    console.log("Active burner address:", account.address);
    console.log("Total burners:", burnerManager.list().length);

    // Now you can use the burner account for transactions
    // Example: Execute a transaction
    // await dojoProvider.execute(
    //     account,
    //     {
    //         contractName: "actions",
    //         entrypoint: "spawn",
    //         calldata: [],
    //     },
    //     "your_namespace"
    // );

    // Burner Management Functions
    setupBurnerUI(burnerManager, account);
}

function setupBurnerUI(burnerManager: any, currentAccount: any) {
    // Create simple UI controls
    const container = document.getElementById("app");
    if (!container) return;

    container.innerHTML = `
        <div>
            <h1>Dojo Burner Wallet</h1>
            <p>Active Burner: <code>${currentAccount.
address}</code></p>
            <p>Total Burners: <span
id="burner-count">${burnerManager.list().length}</span></p>

            <button id="create-burner">Create New Burner</button>
            <button id="clear-burners">Clear All Burners</button>
            <button id="save-burners">Save to Clipboard</button>
            <button id="restore-burners">Restore from
Clipboard</button>

            <div>
                <label>Select Burner:</label>
                <select id="burner-select"></select>
            </div>
        </div>
    `;

    // Populate burner selector
    const updateBurnerList = () => {
        const select = document.getElementById("burner-select") as
HTMLSelectElement;
        select.innerHTML = "";

        burnerManager.list().forEach((burner: any) => {
            const option = document.createElement("option");
            option.value = burner.address;
            option.textContent = burner.address;
            option.selected = burner.active;
            select.appendChild(option);
        });

        const countEl = document.getElementById("burner-count");
        if (countEl) countEl.textContent = burnerManager.list().
length.toString();
    };

    updateBurnerList();

    // Create new burner
    document.getElementById("create-burner")?.
addEventListener("click", async () => {
        console.log("Creating new burner...");
        await burnerManager.create();
        updateBurnerList();
        console.log("✅ New burner created");
    });

    // Clear all burners
    document.getElementById("clear-burners")?.
addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all burners?"))
{
            burnerManager.clear();
            updateBurnerList();
            console.log("✅ All burners cleared");
        }
    });

    // Save burners to clipboard
    document.getElementById("save-burners")?.
addEventListener("click", async () => {
        try {
            await burnerManager.copyBurnersToClipboard();
            alert("Burners saved to clipboard!");
        } catch (error) {
            console.error("Failed to save burners:", error);
        }
    });

    // Restore burners from clipboard
    document.getElementById("restore-burners")?.
addEventListener("click", async () => {
        try {
            await burnerManager.setBurnersFromClipboard();
            updateBurnerList();
            alert("Burners restored from clipboard!");
        } catch (error) {
            console.error("Failed to restore burners:", error);
        }
    });

    // Switch burner
    document.getElementById("burner-select")?.
addEventListener("change", (e) => {
        const target = e.target as HTMLSelectElement;
        burnerManager.select(target.value);
        console.log("Switched to burner:", target.value);
    });
}

// Initialize the app
main().catch(console.error);

## Step 7: Create HTML (index.html)

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,
initial-scale=1.0">
    <title>Dojo Burner Wallet</title>
</head>
<body>
    <div id="app">Loading...</div>
    <script type="module" src="/src/main.ts"></script>
</body>
</html>

## Step 8: Configure TypeScript (tsconfig.json)

{
    "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "module": "ESNext",
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "esModuleInterop": true
    },
    "include": ["src"]
}

## Step 9: Configure Vite (vite.config.ts)

import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

export default defineConfig({
    plugins: [wasm(), topLevelAwait()],
});

## Step 10: Update package.json

{
    "name": "my-dojo-app",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "@dojoengine/core": "latest",
        "@dojoengine/create-burner": "latest",
        "starknet": "latest"
    },
    "devDependencies": {
        "typescript": "^5.0.0",
        "vite": "^5.0.0",
        "vite-plugin-top-level-await": "^1.4.0",
        "vite-plugin-wasm": "^3.3.0"
    }
}

## Step 11: Get Your Manifest File

You need a manifest_dev.json from your Dojo project:

# In your Dojo project directory
sozo build

# Copy the manifest to your frontend project
cp target/dev/manifest.json /path/to/my-dojo-app/manifest_dev.json

## Step 12: Run the App

npm install
npm run dev

## What This Does

1. Initializes BurnerManager - Creates the burner wallet system
2. Creates first burner - Automatically creates one burner if none
exist
3. Stores in localStorage - Burners persist across page refreshes
4. Provides UI controls - Create, switch, clear, save/restore
burners
5. Returns active account - Ready to use for transactions

## Key Concepts

### BurnerManager Methods:

• init() - Initialize and verify existing burners
• create() - Create and deploy a new burner (auto-funded by master
account)
• list() - Get all burners
• select(address) - Switch active burner
• getActiveAccount() - Get current burner as Account instance
• clear() - Delete all burners
• copyBurnersToClipboard() - Export for backup
• setBurnersFromClipboard() - Import from backup

### Using the Burner for Transactions:

// After setup
const { account, dojoProvider } = await setup(dojoConfig);

// Execute a transaction
await dojoProvider.execute(
    account,  // The burner account
    {
        contractName: "actions",
        entrypoint: "spawn",
        calldata: [],
    },
    "dojo_starter"  // namespace
);

This is the simplest, most minimal setup for a burner wallet in
vanilla TypeScript with zero framework dependencies!
