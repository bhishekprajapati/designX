"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/theme-provider";
import { Toaster } from "react-hot-toast";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          {children}
          <ProgressBar
            height="2px"
            color="rgb(109,40,217)"
            options={{ showSpinner: false }}
            shallowRouting
          />
        </QueryClientProvider>
        <Toaster
          toastOptions={{
            className: "!bg-secondary !text-secondary-foreground",
          }}
        />
      </ThemeProvider>
    </ClerkProvider>
  );
}
