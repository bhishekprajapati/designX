"use client";

import { Button } from "@ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <SignedOut>
        <Button>
          <SignInButton forceRedirectUrl={"/files"} />
        </Button>
      </SignedOut>
      <SignedIn>
        <Button>
          <Link href="/files">My Files</Link>
        </Button>
      </SignedIn>
    </div>
  );
}
