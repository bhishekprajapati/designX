"use client";

import { Block, BlockGroup, BlockLabel } from "./block";
import { LayerList } from "./layers";

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
