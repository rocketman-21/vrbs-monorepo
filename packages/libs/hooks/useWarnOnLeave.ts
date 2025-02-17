"use client";

import { useCallback, useEffect } from "react";

const warningText = "You have unsaved changes - are you sure you want to leave this page?";

export const useWarnOnLeave = (hasUnsavedChanges = false) => {
  const handleWindowClose = useCallback(
    (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      // eslint-disable-next-line no-return-assign
      return (e.returnValue = warningText);
    },
    [hasUnsavedChanges],
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleWindowClose);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, [handleWindowClose]);
};
