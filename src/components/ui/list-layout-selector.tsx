"use client";
import { Button } from "./button";
import { useLayoutContext } from "./layout-context";

export default function ListLayoutSelector() {
  const { layoutMode, setLayoutMode } = useLayoutContext();

  return (
    <div className="flex gap-2">
      <Button
        variant={layoutMode === "grid" ? "default" : "outline"}
        onClick={() => setLayoutMode("grid")}
      >
        Grid
      </Button>
      <Button
        variant={layoutMode === "list" ? "default" : "outline"}
        onClick={() => setLayoutMode("list")}
      >
        List
      </Button>
    </div>
  );
}
