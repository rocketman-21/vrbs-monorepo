"use client";

import { useParams } from "next/navigation";
import { getRevolutionConfig } from "../revolution/config";

export function useRevolutionConfig() {
  const { revolutionId } = useParams();
  return { ...getRevolutionConfig(revolutionId.toString()), revolutionId: revolutionId.toString() };
}
