"use client";

import { Separator } from "@ui/separator";
import { cn } from "@/lib/utils";

type BlockProps = React.ComponentPropsWithoutRef<"div">;
export const Block = ({ className, ...restProps }: BlockProps) => {
  return (
    <>
      <div className={cn(className)} {...restProps} />
      <Separator />
    </>
  );
};

type BlockLabelProps = React.ComponentPropsWithoutRef<"h3">;
export const BlockLabel = ({ className, ...restProps }: BlockLabelProps) => (
  <h3
    className={cn("p-3 pb-0 text-sm font-semibold", className)}
    {...restProps}
  />
);

type BlockGroupProps = React.ComponentPropsWithoutRef<"div">;
export const BlockGroup = ({ className, ...restProps }: BlockGroupProps) => (
  <div className={cn("p-3", className)} {...restProps} />
);

type BlockGroupLabelProps = React.ComponentPropsWithoutRef<"h4">;
export const BlockGroupLabel = ({
  className,
  ...restProps
}: BlockGroupLabelProps) => (
  <h3
    className={cn(
      "mb-1 text-xs tracking-wide text-muted-foreground",
      className
    )}
    {...restProps}
  />
);
