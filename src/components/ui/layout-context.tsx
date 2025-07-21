"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type LayoutMode = "grid" | "list";

interface LayoutContextValue {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid");

  useEffect(() => {
    const saved = localStorage.getItem("layoutMode");
    if (saved === "grid" || saved === "list") {
      setLayoutMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("layoutMode", layoutMode);
  }, [layoutMode]);

  return (
    <LayoutContext.Provider value={{ layoutMode, setLayoutMode }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutContext() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within LayoutProvider");
  }
  return context;
}
