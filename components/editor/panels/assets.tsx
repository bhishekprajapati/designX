"use client";

import { Block, BlockGroup, BlockLabel } from "@components/blocks";
import { LayerList } from "@editor/assets/layers";

const AssetsPanel = () => {
  return (
    <Block>
      <BlockLabel>Layers</BlockLabel>
      <BlockGroup>
        <LayerList />
      </BlockGroup>
    </Block>
  );
};

export default AssetsPanel;
