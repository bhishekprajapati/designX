import { FabricObject } from "fabric";

FabricObject.customProperties = ["name", "id"];

declare module "fabric" {
  interface FabricObject {
    id: string;
    name: string;
    type: LayerType;
  }

  interface SerializedObjectProps {
    id: string;
    name: string;
  }
}

export * from "./rectangle-layer";
