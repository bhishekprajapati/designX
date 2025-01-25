type ArrayType<T> = T extends (infer U)[] ? U : never;

type LayerType = "Rect" | "Circle";

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_LIVEBLOCK_PK: string;
    LIVEBLOCKS_SK: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
  }
}
