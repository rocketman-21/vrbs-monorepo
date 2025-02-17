"use client";

import { useRevolution } from "app/libs/useRevolution";
import ProtocolDetails from "./ProtocolDetails";
import SmartContractsList from "./SmartContracts";

export const SmartContractDetails = () => {
  const { addresses, points } = useRevolution();

  if (!addresses?.pointsEmitter || !points) return null;

  return (
    <div className="flex w-full flex-col">
      <ProtocolDetails />
      <SmartContractsList />
    </div>
  );
};
