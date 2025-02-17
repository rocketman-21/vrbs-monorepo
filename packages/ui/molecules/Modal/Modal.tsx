"use client";

import { useRouter } from "next/navigation";
import { StaticModal, Props as StaticModalProps } from "../StaticModal/StaticModal";

type Props = Omit<StaticModalProps, "isOpen" | "closeModal">;

export const Modal = (props: Props) => {
  const router = useRouter();

  return <StaticModal closeModal={() => router.back()} isOpen {...props} />;
};

export default Modal;
