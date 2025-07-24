import { useTheme } from "next-themes";

export default function BackgroundGradient() {
  const { theme } = useTheme();

  const gradient =
    theme === "dark"
      ? "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(0,0,0,0.06) 0%, transparent 70%)";

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[-1]"
      style={{ background: gradient }}
    />
  );
}
