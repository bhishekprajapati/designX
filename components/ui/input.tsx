import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftElement, rightElement, ...props }, ref) => {
    return (
      <div className="px-2 py-1 gap-2 flex items-center border border-input rounded-md bg-secondary">
        {leftElement}
        <input
          type={type}
          className={cn(
            "flex h-7 w-full bg-transparent text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightElement}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
