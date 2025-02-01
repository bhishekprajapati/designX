import * as React from "react";
import { Mode } from "react-hook-form";
import { z, ZodTypeAny } from "zod";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
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

type InputControlProps<T extends ZodTypeAny> = Omit<
  InputProps,
  "onChange" | "onBlur"
> & {
  defaultValue?: z.infer<T>;
  validation: {
    schema: T;
    onSuccess: (data: z.infer<T>) => any;
    onError: (ctx: {
      defaultValue?: z.infer<T>;
      lastValidatedValue?: z.infer<T>;
      setValue: (value: z.infer<T>) => any;
    }) => any;
  };
  transformer?: {
    to: (data: z.infer<T>) => string;
    from: (data: string) => string;
  };
};

export function InputControl<T extends ZodTypeAny>(
  props: InputControlProps<T>
) {
  const {
    defaultValue = undefined,
    validation,
    transformer,
    ...inputProps
  } = props;
  const { schema, onError, onSuccess } = validation;
  const lastValidatedValueRef = React.useRef<z.infer<T>>();

  const parseValue = (value: string) =>
    transformer?.from ? transformer.from(value) : value;

  const formatValue = (value: z.infer<T>) =>
    transformer?.to ? transformer.to(value) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseValue(e.target.value);
    const result = schema.safeParse(value);

    if (!result.success) {
      onError({
        setValue(value) {
          e.target.value = formatValue(
            schema.safeParse(value).data ?? defaultValue
          );
        },
        defaultValue,
        lastValidatedValue: lastValidatedValueRef.current,
      });
      return;
    }

    lastValidatedValueRef.current = result.data;
    onSuccess(result.data);
  };

  return (
    <Input
      defaultValue={formatValue(defaultValue)}
      spellCheck="false"
      autoComplete="false"
      onChange={handleChange}
      onBlur={handleChange}
      onFocus={(e) => e.target.select()}
      {...inputProps}
    />
  );
}
