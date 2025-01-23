type ArrayType<T> = T extends (infer U)[] ? U : never;

type LayerType = "Rect" | "Circle";
