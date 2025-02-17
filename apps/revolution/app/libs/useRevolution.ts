"use client";

import { useContext } from "react";
import { RevolutionContext } from "app/components/RevolutionProvider";

export const useRevolution = () => {
  const context = useContext(RevolutionContext);
  if (context === undefined) {
    throw new Error(`useRevolution must be used within a RevolutionProvider`);
  }
  return context;
};
