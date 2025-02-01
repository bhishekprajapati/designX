"use client";

import { useNetworkState } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";
import useToaster from "@/hooks/use-toaster";

const NetworkStateNotification = () => {
  const toaster = useToaster();
  const { online } = useNetworkState();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      const timer = setTimeout(() => {
        isFirstRender.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }

    online
      ? toaster.succcess("Connected")
      : toaster.error("Disconnected, Changes will be saved on re-connection!");
  }, [online]);

  return <></>;
};

export default NetworkStateNotification;
