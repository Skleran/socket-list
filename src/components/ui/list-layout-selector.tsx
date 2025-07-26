"use client";
import { LayoutGrid, Rows3 } from "lucide-react";
import { Button } from "./button";
import { useLayoutContext } from "./layout-context";

export default function ListLayoutSelector() {
  const { layoutMode, setLayoutMode } = useLayoutContext();

  return (
    <div className="flex gap-2">
      <Button
        variant={layoutMode === "grid" ? "default" : "outline"}
        onClick={() => setLayoutMode("grid")}
        className="w-[78px]"
      >
        <LayoutGrid />
        Grid
      </Button>
      <Button
        variant={layoutMode === "list" ? "default" : "outline"}
        onClick={() => setLayoutMode("list")}
        className="w-[78px]"
      >
        <Rows3 />
        List
      </Button>
    </div>
  );
}
