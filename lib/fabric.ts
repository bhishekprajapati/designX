import { Circle, CircleProps, FabricObject, Rect, RectProps } from "fabric";
import { nanoid } from "nanoid";

FabricObject.customProperties = ["name", "id"];
FabricObject.prototype.lock = function () {
  this.lockMovementX = true;
  this.lockMovementY = true;
  this.lockScalingX = true;
  this.lockScalingY = true;
  this.lockRotation = true;
  this.lockSkewingX = true;
  this.lockSkewingY = true;
  this.isLocked = true;
};

FabricObject.prototype.lock = function () {
  this.lockMovementX = false;
  this.lockMovementY = false;
  this.lockScalingX = false;
  this.lockScalingY = false;
  this.lockRotation = false;
  this.lockSkewingX = false;
  this.lockSkewingY = false;
  this.isLocked = false;
};

type ShapeOptions<T> = Omit<Partial<T>, "id" | "name"> & {
  name: string;
};

export const shapes = {
  rect: (options: ShapeOptions<RectProps>) => {
    const {
      isLocked = false,
      width = 50,
      height = 50,
      fill = "grey",
      top = 100,
      left = 100,
      ...rest
    } = options;

    return new Rect({
      id: nanoid(),
      isLocked,
      width,
      height,
      fill,
      top: top - height / 2,
      left: left - width / 2,
      ...rest,
    });
  },
  circle: (options: ShapeOptions<CircleProps>) => {
    const {
      isLocked = false,
      radius = 50,
      top = 100,
      left = 100,
      fill = "grey",
      ...rest
    } = options;

    return new Circle({
      id: nanoid(),
      isLocked,
      radius,
      fill,
      top: top - radius,
      left: left - radius,
      ...rest,
    });
  },
} as const;

export type Shape = keyof typeof shapes;

declare module "fabric" {
  interface FabricObject {
    id: string;
    name: string;
    isLocked: boolean;
    type: Shape;
    lock: () => void;
    unlock: () => void;
  }

  interface SerializedObjectProps {
    id: string;
    name: string;
    isLocked: boolean;
  }
}
