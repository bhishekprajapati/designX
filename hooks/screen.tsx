"use client";

import { useWindowSize } from "@uidotdev/usehooks";

export const useIsSmallScreen = () => {
  const width = useWindowSize().width ?? 0;
  return width < 1024;
};
