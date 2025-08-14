"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeFavicon() {
  const { theme } = useTheme();

  useEffect(() => {
    const updateFavicon = () => {
      const link = document.querySelector(
        "link[rel~='icon']"
      ) as HTMLLinkElement;
      if (link) {
        link.href =
          theme === "dark" ? "/favicon-light.ico" : "/favicon-light.ico";
      }
    };

    updateFavicon();
  }, [theme]);

  return null;
}
