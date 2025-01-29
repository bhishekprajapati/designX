"use client";

import { Button } from "@/components/ui/button";
import { Link2, Unlink2 } from "lucide-react";
import { useMutation, useStorage } from "@liveblocks/react";
import ColorPicker from "@/components/color-picker";
import { Block, BlockGroup, BlockLabel } from "./block";
import { Input } from "@/components/ui/input";
import { useActiveObject } from "@/hooks/use-fabric";
import { Color } from "@/utils/colors";
import { useCanvas } from "@/hooks/use-fabric";
import { Point } from "fabric";
import { FocusEventHandler, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

const ColabControls = () => {
  return (
    <div className="flex items-center justify-between">
      <Badge variant="secondary">Design</Badge>
      <ZoomControl />
    </div>
  );
};

const ZoomControl = () => {
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 20;
  const ZOOM_FACTOR = 0.999;

  const canvas = useCanvas();
  const [zoom, setZoom] = useState(canvas.getZoom());
  const inputRef = useRef<HTMLInputElement>(null);

  const toPercentage = (value: number) => {
    if (Number.isNaN(value)) return value;
    return Math.trunc(value * 100);
  };

  const handleZoomChange = (zoom: number, point?: Point) => {
    const boundedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
    point
      ? canvas.zoomToPoint(point, boundedZoom)
      : canvas.setZoom(boundedZoom);
    setZoom(boundedZoom);

    if (inputRef.current) {
      inputRef.current.value = toPercentage(boundedZoom).toString();
    }
  };

  const handleInputZoomChange: FocusEventHandler<HTMLInputElement> = (e) => {
    const value = parseFloat(e.target.value) / 100;
    if (Number.isNaN(value)) {
      if (inputRef.current) {
        inputRef.current.value = toPercentage(zoom).toString();
      }
      return;
    }
    handleZoomChange(value);
  };

  useEffect(() => {
    canvas.on("mouse:wheel", (ctx) => {
      if (ctx.e.ctrlKey) {
        const delta = ctx.e.deltaY;
        const zoom = canvas.getZoom() * ZOOM_FACTOR ** delta;
        handleZoomChange(
          zoom,
          new Point({ x: ctx.e.offsetX, y: ctx.e.offsetY })
        );
        ctx.e.preventDefault();
        ctx.e.stopPropagation();
      }
    });
  }, [canvas]);

  useEffect(() => {
    const doubleOrHalve = (ev: KeyboardEvent) => {
      if (!ev.ctrlKey || !["+", "-"].includes(ev.key)) return;
      handleZoomChange(ev.key === "+" ? zoom * 2 : zoom / 2);
    };

    window.addEventListener("keydown", doubleOrHalve);
    return () => {
      window.removeEventListener("keydown", doubleOrHalve);
    };
  }, [canvas, zoom]);

  return (
    <Input
      ref={inputRef}
      defaultValue={`${toPercentage(zoom)}`}
      onBlur={handleInputZoomChange}
      className="w-10 h-4"
      spellCheck="false"
      autoComplete="false"
    />
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

type DimensionControlProps = {
  width: number;
  height: number;
  linked: boolean;
  onLinkChange: (isLinked: boolean) => void;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
};

export const DimensionControl = (props: DimensionControlProps) => {
  const { width, height, linked, onHeightChange, onLinkChange, onWidthChange } =
    props;

  return (
    <div className="flex gap-2 items-center">
      <Input
        defaultValue={width}
        min={0}
        leftElement={
          <span className="text-xs text-secondary-foreground">W</span>
        }
        onChange={(e) => onWidthChange(parseFloat(e.target.value))}
      />
      <Input
        defaultValue={height}
        type="number"
        min={0}
        leftElement={
          <span className="text-xs text-secondary-foreground">H</span>
        }
        onChange={(e) => onHeightChange(parseFloat(e.target.value))}
      />
      <Button size="icon" variant="ghost" onClick={() => onLinkChange(!linked)}>
        {linked ? (
          <Link2 className="rotate-90" size={16} />
        ) : (
          <Unlink2 className="rotate-90" size={16} />
        )}
      </Button>
    </div>
  );
};

export const OpacityControl = () => (
  <div>
    <Input
      defaultValue={"100%"}
      leftElement={
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            className="fill-secondary-foreground"
            fillRule="evenodd"
            d="M8 7h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1M6 8a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zm8.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M13 10.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-2 2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-2 2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1.5.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2-2a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m.5 1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m2-4a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-.5 2.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m.5 1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"
            clipRule="evenodd"
          />
        </svg>
      }
      spellCheck="false"
      autoComplete="false"
    />
  </div>
);

export const CornerRadiusControl = () => (
  <div>
    <Input
      defaultValue={0}
      min={0}
      leftElement={
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            className="fill-secondary-foreground"
            fillRule="evenodd"
            d="M12.478 8H15.5a.5.5 0 0 1 0 1h-3c-.708 0-1.21 0-1.601.032-.386.032-.622.092-.807.186a2 2 0 0 0-.874.874c-.094.185-.154.42-.186.807C9 11.29 9 11.792 9 12.5v3a.5.5 0 0 1-1 0v-3.022c0-.681 0-1.223.036-1.66.036-.448.113-.83.291-1.18a3 3 0 0 1 1.311-1.311c.35-.178.732-.255 1.18-.291C11.254 8 11.796 8 12.477 8"
            clipRule="evenodd"
          ></path>
        </svg>
      }
    />
  </div>
);

const LayerControls = () => {
  const canvas = useCanvas();
  const obj = useActiveObject();
  if (!obj) return <></>;

  const layerType = obj?.type;

  const FillControl = () => {
    const handleFillChange = (fill: string) => {
      obj.fill = fill;
      canvas.renderAll();
    };

    const color = Color.toHex(
      obj?.fill === null ? "#000" : obj.fill.toString()
    );

    return (
      <Block>
        <BlockLabel>Fill</BlockLabel>
        <BlockGroup className="pe-0">
          {color && <ColorPicker color={color} onChange={handleFillChange} />}
        </BlockGroup>
      </Block>
    );
  };

  return (
    <>
      {/* <Block>
        <BlockLabel>Layout</BlockLabel>
        <BlockGroup>
          <BlockGroupLabel>Dimensions</BlockGroupLabel>
          <DimensionControl
            width={50}
            height={50}
            onWidthChange={console.log}
            onHeightChange={console.log}
            onLinkChange={console.log}
            linked
          />
        </BlockGroup>
      </Block> */}
      {/* <Block>
        <BlockLabel>Appearance</BlockLabel>
        <div className="flex gap-2">
          <BlockGroup className="pe-0">
            <BlockGroupLabel>Opacity</BlockGroupLabel>
            <OpacityControl />
          </BlockGroup>
          {layerType === "rect" && (
            <BlockGroup className="ps-0">
              <BlockGroupLabel>Corner radius</BlockGroupLabel>
              <CornerRadiusControl />
            </BlockGroup>
          )}
        </div>
      </Block> */}
      <FillControl />
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
      <LayerControls />
    </>
  );
};

export default ControlPanel;
