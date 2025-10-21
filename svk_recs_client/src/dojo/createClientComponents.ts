import { overridableComponent } from "@dojoengine/recs";
import type { ContractComponents } from "./generated/contractComponents";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({
    contractComponents,
}: {
    contractComponents: ContractComponents;
}) {
    return {
        ...contractComponents,
        Game: overridableComponent(contractComponents.Game),
        OrbsInGame: overridableComponent(contractComponents.OrbsInGame),
        GamePack: overridableComponent(contractComponents.GamePack),
        Player: overridableComponent(contractComponents.Player),
    };
}
