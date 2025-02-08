"use client";

import { Block, BlockGroup, BlockLabel } from "@components/blocks";
import { FabricObjectList } from "@editor/assets/objects";

const AssetsPanel = () => {
  return (
    <Block>
      <BlockLabel>Layers</BlockLabel>
      <BlockGroup>
        <FabricObjectList />
      </BlockGroup>
    </Block>
  );
};

export default AssetsPanel;
