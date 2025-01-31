"use client";

import { useMutation, useStorage } from "@liveblocks/react";

import ActivatedObject from "@/components/activated-object";
import ColorPicker from "@/components/color-picker";
import {
  Block,
  BlockGroup,
  BlockGroupLabel,
  BlockLabel,
} from "@components/blocks";
import { Badge } from "@ui/badge";

import CornerRadiusControl from "@editor/canvas/controls/corner-radius";
import DimensionControl from "@editor/canvas/controls/dimension-control";
import FillControl from "@editor/canvas/controls/fill-control";
import OpacityControl from "@editor/canvas/controls/opacity-control";
import ZoomControl from "@editor/canvas/controls/zoom-control";

import { useActivatedObject } from "@/hooks/use-fabric";
import { isRect } from "@/lib/fabric";

const ColabControls = () => {
  return (
    <div className="flex items-center justify-between">
      <Badge variant="secondary">Design</Badge>
      <ZoomControl />
    </div>
  );
};

const PageBackgroundControl = () => {
  const background =
    useStorage(({ fabricCanvas }) => fabricCanvas.background) ?? "gray";

  const setColor = useMutation(({ storage }, color: string) => {
    const fabric = storage.get("fabricCanvas");
    fabric.update({
      background: color,
    });
  }, []);

  return <ColorPicker color={background} onChange={setColor} />;
};

const LayerControls = () => {
  const obj = useActivatedObject();

  return (
    <>
      <Block>
        <BlockLabel>Layout</BlockLabel>
        <BlockGroup>
          <BlockGroupLabel>Dimensions</BlockGroupLabel>
          <DimensionControl />
        </BlockGroup>
      </Block>
      <Block>
        <BlockLabel>Appearance</BlockLabel>
        <div className="flex gap-2">
          <BlockGroup className="pe-0">
            <BlockGroupLabel>Opacity</BlockGroupLabel>
            <OpacityControl />
          </BlockGroup>
          {isRect(obj) && (
            <BlockGroup className="ps-0">
              <BlockGroupLabel>Corner radius</BlockGroupLabel>
              <CornerRadiusControl />
            </BlockGroup>
          )}
        </div>
      </Block>
      <Block>
        <BlockLabel>Fill</BlockLabel>
        <BlockGroup className="pe-0">
          <FillControl />
        </BlockGroup>
      </Block>
    </>
  );
};

const ControlPanel = () => {
  return (
    <>
      <Block>
        <BlockGroup>
          <ColabControls />
        </BlockGroup>
      </Block>
      <Block>
        <BlockLabel>Page</BlockLabel>
        <BlockGroup>
          <PageBackgroundControl />
        </BlockGroup>
      </Block>
      <ActivatedObject>
        <LayerControls />
      </ActivatedObject>
    </>
  );
};

export default ControlPanel;
