import type { SchemaType } from "@dojoengine/sdk";
import { useDojoSDK } from "@dojoengine/sdk/react";
import type { setupWorld } from "../bindings/typescript/contracts.gen";

export const useDojoSdk = () => {
  return useDojoSDK<typeof setupWorld, SchemaType>();
};
