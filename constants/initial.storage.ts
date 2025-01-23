import { LiveList, LiveObject } from "@liveblocks/client";

const initialStorage: Liveblocks["Storage"] = {
  fabricCanvas: new LiveObject({
    background: "gray",
    layers: new LiveList([]),
  }),
};

export default initialStorage;
