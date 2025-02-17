"use client";

import Link from "next/link";
import SvgPlus from "@cobuild/ui/pixel-icons/Plus";

interface Props {
  filter?: string;
  modal: "create" | "submit";
}

export const CreateFloatingButton = (props: Props) => {
  const { filter = "", modal } = props;

  return (
    <Link href={`?filter=${filter}&${modal}=true}`} className="text-xl">
      <button className="bg-lead-300 hover:bg-lead-200 dark:hover:bg-lead-100 dark:bg-lead-200 flex items-center justify-center rounded-full p-2 text-black">
        <SvgPlus className="h-6 w-6" />
      </button>
    </Link>
  );
};

export default CreateFloatingButton;
