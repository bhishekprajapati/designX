"use client";

import { Button } from "@ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <Button>
          <Link href="/files">My Files</Link>
        </Button>
      </SignedIn>
    </>
  );
}
