"use client";

import { useIsSmallScreen } from "@/hooks/screen";

export const WhenLargeScreen = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isSmallScreen = useIsSmallScreen();
  if (isSmallScreen) return <></>;
  return children;
};

export const WhenSmallScreen = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isSmallScreen = useIsSmallScreen();
  if (isSmallScreen) return children;
  return <></>;
};
