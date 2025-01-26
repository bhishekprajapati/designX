"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const FloatingModal = DialogPrimitive.Root;

const FloatingModalTrigger = DialogPrimitive.Trigger;

const FloatingModalPortal = DialogPrimitive.Portal;

const FloatingModalClose = () => (
  <DialogPrimitive.Close className="ms-auto rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
);

type FloatingModalContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
>;

const FloatingModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  FloatingModalContentProps
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={cn("fixed left-[50%] top-[50%] z-50 max-w-[16rem]", className)}
    data-content
    {...props}
  >
    <div className="bg-background border shadow-2xl rounded-2xl">
      {children}
    </div>
  </DialogPrimitive.Content>
));
FloatingModalContent.displayName = DialogPrimitive.Content.displayName;

const FloatingModalHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col p-4 space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  >
    <div className="flex items-center">{children}</div>
  </div>
);
FloatingModalHeader.displayName = "FloatingModalHeader";

const FloatingModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
FloatingModalTitle.displayName = DialogPrimitive.Title.displayName;

export {
  FloatingModal,
  FloatingModalPortal,
  FloatingModalTrigger,
  FloatingModalClose,
  FloatingModalContent,
  FloatingModalHeader,
  FloatingModalTitle,
};
