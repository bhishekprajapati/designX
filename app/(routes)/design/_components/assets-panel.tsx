"use client";

import useCanvas from "@/hooks/use-canvas";
import { Block, BlockGroup, BlockLabel } from "./block";
import Layers from "./layers";

const AssetsPanel = () => {
  const canvas = useCanvas();

  if (!canvas) return <></>;

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
