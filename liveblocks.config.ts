import type { JsonObject, LiveList, LiveObject } from "@liveblocks/client";

interface IBaseLiveLayerData extends JsonObject {
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

export interface ILiveRectLayerData extends IBaseLiveLayerData {
  type: "Rect";
  rx: number;
  ry: number;
}

export interface ILiveCircleLayerData extends IBaseLiveLayerData {
  type: "Circle";
  counterClockwise: false;
  endAngle: 360;
  radius: 50;
  startAngle: 0;
}

export type TLiveLayerData = ILiveRectLayerData | ILiveCircleLayerData;

declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
    };

    Storage: {
      fabricCanvas: LiveObject<{
        background: string;
        layers: LiveList<LiveObject<TLiveLayerData>>;
      }>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        // Example properties, for useSelf, useUser, useOthers, etc.
        // name: string;
        // avatar: string;
      };
    };

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

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

export {};
