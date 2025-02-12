import { Canvas, Circle, FabricObject, IText, Rect } from "fabric";

export const isRect = (obj: FabricObject) => obj instanceof Rect;
export const isCircle = (obj: FabricObject) => obj instanceof Circle;
export const isIText = (obj: any): obj is IText => obj instanceof IText;

export const lockCanvas = (canvas: Canvas) => {
  canvas.selection = false;
  canvas.skipTargetFind = true;
  canvas.renderAll();
};

export const unLockCanvas = (canvas: Canvas) => {
  canvas.selection = true;
  canvas.skipTargetFind = false;
  canvas.renderAll();
};
