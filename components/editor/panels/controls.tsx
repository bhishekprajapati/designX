"use client";

import { useMutation, useStorage } from "@liveblocks/react";
import { ErrorBoundary } from "react-error-boundary";

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

import { useActivatedObject, useCanvas } from "@/hooks/use-fabric";
import { isCircle, isIText, isRect } from "@/lib/fabric";
import CanvasSnapshot from "../canvas/snapshot";
import { useEffect } from "react";
import { Circle, IText, Rect } from "fabric";

const ColabControls = () => {
  return (
    <div className="flex items-center justify-between">
      <Badge variant="secondary">Design</Badge>
      <ZoomControl />
    </div>
  );
};

const PageBackgroundControl = () => {
  const canvas = useCanvas();
  const background =
    useStorage(({ fabricCanvas }) => fabricCanvas.background) ?? "gray";

  const setColor = useMutation(({ storage }, color: string) => {
    const fabric = storage.get("fabricCanvas");
    fabric.update({
      background: color,
    });
  }, []);

  const handleColorChange = (color: string) => {
    canvas.backgroundColor = color;
    canvas.requestRenderAll();
    setColor(color);
  };

  useEffect(() => {
    if (canvas.backgroundColor === background) return;
    canvas.backgroundColor = background;
    canvas.requestRenderAll();
  }, [background]);

  return <ColorPicker color={background} onChange={handleColorChange} />;
};

const RectangleObjectControls = ({ obj }: { obj: Rect }) => {
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
          <BlockGroup className="ps-0">
            <BlockGroupLabel>Corner radius</BlockGroupLabel>
            <CornerRadiusControl />
          </BlockGroup>
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

const CircleObjectControls = ({ obj }: { obj: Circle }) => {
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

const ITextObjectControls = ({ obj }: { obj: IText }) => {
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
          <BlockGroup className="ps-0">
            <BlockGroupLabel>Corner radius</BlockGroupLabel>
            <CornerRadiusControl />
          </BlockGroup>
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

const LayerControls = () => {
  const obj = useActivatedObject();
  if (isRect(obj)) return <RectangleObjectControls obj={obj} />;
  if (isCircle(obj)) return <CircleObjectControls obj={obj} />;
  if (isIText(obj)) return <ITextObjectControls obj={obj} />;
  return <></>;
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
      <Block>
        <BlockLabel>Export</BlockLabel>
        <ErrorBoundary fallback={<></>}>
          <BlockGroup>
            <BlockGroupLabel>Preview</BlockGroupLabel>
            <CanvasSnapshot />
          </BlockGroup>
        </ErrorBoundary>
      </Block>
    </>
  );
};

export default ControlPanel;
