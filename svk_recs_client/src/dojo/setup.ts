import type { DojoConfig } from "@dojoengine/core";
import { DojoProvider } from "@dojoengine/core";
import { ToriiClient } from "@dojoengine/torii-client";
import { createClientComponents } from "./createClientComponents";
import { defineContractComponents } from "./generated/defineContractComponents";
import { world } from "./world";
import { setupWorld } from "./generated/typescript/contracts.gen";
import { Account } from "starknet";
import type { ArraySignatureType } from "starknet";
import { BurnerManager } from "@dojoengine/create-burner";
import { getSyncEntities, getSyncEvents } from "@dojoengine/state";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: DojoConfig) {
    const toriiClient = new ToriiClient({
        toriiUrl: config.toriiUrl,
        worldAddress: config.manifest.world.address || "",
    });

    const contractComponents = defineContractComponents(world);

    const clientComponents = createClientComponents({ contractComponents });

    const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);

    const sync = await getSyncEntities(
        toriiClient,
        contractComponents as any,
        {} as any,
    );

    const eventSync = getSyncEvents(
        toriiClient,
        contractComponents as any,
        {} as any,
    );

    const client = await setupWorld(dojoProvider);

    const burnerManager = new BurnerManager({
        masterAccount: new Account({
            provider: dojoProvider.provider,
            address: config.masterAddress,
            signer: config.masterPrivateKey,
        }),
        accountClassHash: config.accountClassHash,
        rpcProvider: dojoProvider.provider,
        feeTokenAddress: config.feeTokenAddress,
    });

    try {
        await burnerManager.init();
        if (burnerManager.list().length === 0) {
            await burnerManager.create();
        }
    } catch (e) {
        console.error(e);
    }

    return {
        client,
        clientComponents,
        contractComponents,
        publish: (typedData: string, signature: ArraySignatureType) => {
            toriiClient.publishMessage({
                message: typedData,
                signature,
                world_address: config.manifest.world.address || "",
            });
        },
        config,
        dojoProvider,
        burnerManager,
        toriiClient,
        eventSync,
        sync,
    };
}
