"use client";

import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { ICreationsFilter } from "@cobuild/libs/revolution/interfaces";
import { ActionButton } from "@cobuild/ui/molecules/ActionButton/ActionButton";
import CalendarArrowRight from "@cobuild/ui/pixel-icons/CalendarArrowRight";
import Flag from "@cobuild/ui/pixel-icons/Flag";
import Sliders2 from "@cobuild/ui/pixel-icons/Sliders2";
import Trophy from "@cobuild/ui/pixel-icons/Trophy";
import Zap from "@cobuild/ui/pixel-icons/Zap";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";

interface Props {
  revolutionId: string;
}

export const CreationsFilter = (props: Props) => {
  const [filter] = useUrlState<ICreationsFilter>("filter", "next-up");
  const router = useRouter();
  const { hasAuction } = useRevolution();

  return (
    <ActionButton
      icon={Sliders2}
      className="bg-lead-300 hover:bg-lead-200 dark:hover:bg-lead-100 dark:bg-lead-200 text-black"
    >
      <ActionButton.Option
        icon={CalendarArrowRight}
        isActive={filter === "next-up"}
        onClick={() => router.push(`?filter=next-up`)}
      >
        Next up
      </ActionButton.Option>

      <ActionButton.Option
        icon={Zap}
        isActive={filter === "recent"}
        onClick={() => router.push(`?filter=recent`)}
      >
        New
      </ActionButton.Option>

      <ActionButton.Option
        icon={Trophy}
        isActive={filter === "auctioned"}
        onClick={() => router.push(`?filter=auctioned`)}
      >
        {hasAuction ? "Auctioned" : "Dropped"}
      </ActionButton.Option>

      <ActionButton.Option
        icon={Flag}
        isActive={filter === "hidden"}
        onClick={() => router.push(`?filter=hidden`)}
      >
        Flagged
      </ActionButton.Option>
    </ActionButton>
  );
};
