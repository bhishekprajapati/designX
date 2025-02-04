import * as React from "react";
import { z, ZodTypeAny } from "zod";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerClasses = cn(
  "gap-2 flex items-center",
  "px-[.75em] py-[.25em] border border-input rounded-md",
  "bg-secondary"
);

const input = cva(containerClasses, {
  variants: {
    sizeVariant: {
      xs: "text-xs",
      sm: "text-sm",
      lg: "text-lg",
      xl: "text-xl",
    },
  },
  defaultVariants: {
    sizeVariant: "xs",
  },
});

type InputProps = React.ComponentProps<"input"> & {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
} & VariantProps<typeof input>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, leftElement, rightElement, sizeVariant, ...props },
    ref
  ) => {
    const containerClasses = input({ sizeVariant, className });
    const inputClasses = cn(
      "bg-transparent text-base shadow-sm placeholder:text-muted-foreground transition-colors",
      "file:bg-transparent file:text-sm file:font-medium file:text-foreground file:border-0",
      "flex h-7 w-full",
      "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "outline-none"
    );

    return (
      <div className={containerClasses}>
        {leftElement}
        <input type={type} className={inputClasses} ref={ref} {...props} />
        {rightElement}
      </div>
    );
  }
);

Input.displayName = "Input";

type InputControlHandlerContext<T> = {
  value: T;
  setValue: (value: T) => void;
};

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
