import { Circle, FabricObject, Rect } from "fabric";

export const isRect = (obj: FabricObject) => obj instanceof Rect;
export const isCircle = (obj: FabricObject) => obj instanceof Circle;
