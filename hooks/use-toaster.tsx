"use client";

import { toast, ToastOptions } from "react-hot-toast";
import { CheckCircle2, X } from "lucide-react";

const useToaster = () => {
  const succcess = (message: string, opts?: ToastOptions) => {
    toast(
      <span className="flex items-center gap-2">
        <CheckCircle2 className="fill-green-400 stroke-green-400 [&_path]:stroke-white" />
        {message}
      </span>,
      opts
    );
  };

  const error = (message: string, opts?: ToastOptions) => {
    toast(
      <span className="flex items-center gap-2">
        <span className="rounded-full bg-red-400  inline-flex items-center justify-center p-1">
          <X size={16} />
        </span>
        {message}
      </span>,
      opts
    );
  };

  return {
    succcess,
    error,
  };
};
export default useToaster;
