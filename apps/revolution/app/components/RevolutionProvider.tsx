"use client";

import { IRevolution } from "@cobuild/database/models/revolution/revolutions/IRevolution";
import { Serialized } from "@cobuild/database/types";
import { createContext, PropsWithChildren } from "react";

export const RevolutionContext = createContext<Serialized<IRevolution> | undefined>(undefined);
RevolutionContext.displayName = "RevolutionContext";

export const RevolutionProvider = (
  props: PropsWithChildren<{
    revolution: Serialized<IRevolution>;
  }>,
) => {
  return (
    <RevolutionContext.Provider value={props.revolution}>
      {props.children}
    </RevolutionContext.Provider>
  );
};
