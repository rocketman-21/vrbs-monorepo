"use client";

import { useDarkMode } from "@cobuild/libs/hooks/useDarkMode";
import { useRevolution } from "app/libs/useRevolution";
import { useLayoutEffect } from "react";

interface Props {
  enabled: boolean;
}

export const GoalDarkMode = (props: Props) => {
  const { enabled } = props;
  const { enableDarkMode, disableDarkMode } = useDarkMode();

  const { config } = useRevolution();

  useLayoutEffect(() => {
    if (enabled && !config.darkMode) enableDarkMode();
    if (!enabled && config.darkMode) disableDarkMode();

    return () => {
      config.darkMode ? enableDarkMode() : disableDarkMode();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
