"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/contexts/theme-provider";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster
          toastOptions={{
            className: "!bg-secondary !text-secondary-foreground",
          }}
        />
      </ThemeProvider>
    </ClerkProvider>
  );
}
