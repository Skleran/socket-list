import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function BackgroundGradient() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const gradient =
    resolvedTheme === "dark"
      ? "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(0,0,0,0.06) 0%, transparent 70%)";

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[-1]"
      style={{ background: gradient }}
    />
  );
}
