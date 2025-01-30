"use client";

import { useNetworkState } from "@uidotdev/usehooks";
import { CheckCircle2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const NetworkStateNotification = () => {
  const { online } = useNetworkState();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      const timer = setTimeout(() => {
        isFirstRender.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }

    toast(
      online ? (
        <span className="flex items-center gap-2">
          <CheckCircle2 className="fill-green-400 stroke-green-400 [&_path]:stroke-white" />
          Connected
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-red-400  inline-flex items-center justify-center p-1">
            <X size={16} />
          </span>
          Disconnected, Changes will be saved on re-connection!
        </span>
      )
    );
  }, [online]);

  return <></>;
};

export default NetworkStateNotification;
