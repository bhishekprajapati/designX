import { Circle, FabricObject, IText, Rect } from "fabric";

export const isRect = (obj: FabricObject) => obj instanceof Rect;
export const isCircle = (obj: FabricObject) => obj instanceof Circle;
export const isIText = (obj: any): obj is IText => obj instanceof IText;
