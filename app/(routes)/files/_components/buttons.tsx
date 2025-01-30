"use client";

import { createDesign } from "@/app/actions/files";
import { Button } from "@ui/button";

export const CreateDesignButton = () => (
  <Button onClick={() => createDesign("untitled")}>Create new design</Button>
);
