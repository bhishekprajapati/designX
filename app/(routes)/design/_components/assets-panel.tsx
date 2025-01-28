"use client";

import { useCanvas } from "@/hooks/use-fabric";
import { Block, BlockGroup, BlockLabel } from "./block";
import Layers from "./layers";

const AssetsPanel = () => {
  const canvas = useCanvas();

  return (
    <Block>
      <BlockLabel>Layers</BlockLabel>
      <BlockGroup>
        <Layers canvas={canvas} />
      </BlockGroup>
    </Block>
  );
};

export default AssetsPanel;
