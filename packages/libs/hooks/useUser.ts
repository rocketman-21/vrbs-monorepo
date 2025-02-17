"use client";

import { useContext } from "react";
import { UserContext } from "../user/UserProvider";

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within an UserProvider`);
  }
  return context;
};
