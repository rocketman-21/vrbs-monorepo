"use client";

import { useState } from "react";

export function useDarkMode() {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const enable = () => {
    const html = document.querySelector("html");
    if (!html) return;
    html.className = "dark";
    setIsEnabled(true);
  };

  const disable = () => {
    const html = document.querySelector("html");
    if (!html) return;
    html.className = "light";
    setIsEnabled(false);
  };

  return { isDarkMode: isEnabled, enableDarkMode: enable, disableDarkMode: disable };
}
