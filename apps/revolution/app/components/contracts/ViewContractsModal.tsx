"use client";

import { StaticModal } from "@cobuild/ui/molecules/StaticModal/StaticModal";
import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { useRevolution } from "app/libs/useRevolution";
import { SmartContractDetails } from "./SmartContractDetails";

export const ViewContractsModal = () => {
  const { addresses, points, name } = useRevolution();
  const [isOpen, setIsOpen] = useUrlState("viewContracts");

  const closeModal = () => {
    setIsOpen("");
  };

  if (!addresses?.pointsEmitter || !points) return null;

  return (
    <StaticModal
      isOpen={isOpen === "true"}
      closeModal={closeModal}
      title={`${name} Smart Contracts`}
      width="820px"
      showCloseButton
    >
      <div className="md:p-4">
        <SmartContractDetails />
      </div>
    </StaticModal>
  );
};
