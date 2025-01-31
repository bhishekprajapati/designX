"use client";

import { useActiveObject } from "@/hooks/use-fabric";
import { createContext } from "react";

export type TActivatedObjectContext = NonNullable<
  ReturnType<typeof useActiveObject>["0"]
>;

export const ActivatedObjectContext = createContext<
  TActivatedObjectContext | undefined
>(undefined);

type ActivateObjectProps = {
  children: React.ReactNode;
};

const ActivatedObject = (props: ActivateObjectProps) => {
  const { children } = props;
  const [active] = useActiveObject();
  if (!active) return <></>;

  return (
    <ActivatedObjectContext.Provider value={active}>
      {children}
    </ActivatedObjectContext.Provider>
  );
};

export default ActivatedObject;
