import type { JsonObject, LiveList, LiveObject } from "@liveblocks/client";

export type LayerType = "Rect" | "Circle" | "IText";
export type SelectLayerType<T extends LayerType> = T;

interface IBaseLayerData extends JsonObject {
  id: string;
  name: string;
  backgroundColor: string;
  opacity: number;
  // originX: string;
  // originY: string;
  // paintFirst: string;
  top: number;
  left: number;
  width: number;
  height: number;
  angle: 0;
  fill: string;
  // fillRule: string;
  flipX: boolean;
  flipY: boolean;
  // globalCompositeOperation: string;
  scaleX: number;
  scaleY: number;
  shadow: null;
  skewX: number;
  skewY: number;
  stroke: null;
  strokeDashArray: null;
  strokeDashOffset: number;
  // strokeLineCap: string;
  // strokeLineJoin: string;
  strokeMiterLimit: number;
  strokeUniform: boolean;
  strokeWidth: number;
  visible: boolean;
}

export interface IRectLayerData extends IBaseLayerData {
  type: SelectLayerType<"Rect">;
  rx: number;
  ry: number;
}

export interface ICircleLayerData extends IBaseLayerData {
  type: SelectLayerType<"Circle">;
  counterClockwise: false;
  endAngle: 360;
  radius: 50;
  startAngle: 0;
}

export interface ITextLayerData extends IBaseLayerData {
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  fontStyle: string;
  lineHeight: number;
  text: string;
  charSpacing: number;
  textAlign: string;
  styles: any[];
  pathStartOffset: number;
  pathSide: string;
  pathAlign: string;
  underline: boolean;
  overline: boolean;
  linethrough: boolean;
  textBackgroundColor: string;
  direction: string;
  name: string;
  type: SelectLayerType<"IText">;
}

// WARN: DO NOT FORGET KEEP BOTH THE WRITTEN BELOW TYPES IN SYNC
export type TLiveRoomStorage = {
  fabricCanvas: LiveObject<{
    name: string;
    snapshot: string;
    background: string;
    layers: LiveList<
      | LiveObject<IRectLayerData>
      | LiveObject<ICircleLayerData>
      | LiveObject<ITextLayerData>
    >;
  }>;
};

export type TSerializedLiveRoomStorage = {
  fabricCanvas: {
    background: string;
    layers: Array<IRectLayerData | ICircleLayerData>;
  };
};

export type FabricCanvasHydrationState = {
  background: string;
  objects: Array<IRectLayerData | ICircleLayerData>;
};
// --------------------------------------------------------------

type TPresence = {
  cursor: { x: number; y: number } | null;
  randId: string;
};

type UserMeta = {
  id: string;
  info: {
    firstName: string | null;
    lastName: string | null;
    avatar: string;
    email: string;
  };
};

export type TRoomMeta = {
  name: string;
  type: "design";
};

declare global {
  interface Liveblocks {
    Presence: TPresence;
    Storage: TLiveRoomStorage;
    UserMeta: UserMeta;

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {};
    // Example has two events, using a union
    // | { type: "PLAY" }
    // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    RoomInfo: {};
  }
}

export {};
