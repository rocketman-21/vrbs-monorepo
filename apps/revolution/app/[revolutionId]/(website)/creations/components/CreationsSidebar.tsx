"use client";

import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { ICreationsFilter } from "@cobuild/libs/revolution/interfaces";
import { Button } from "@cobuild/ui/atoms/Button";
import { Markdown } from "@cobuild/ui/atoms/Markdown";
import { Icon } from "@cobuild/ui/atoms/types";
import CalendarArrowRight from "@cobuild/ui/pixel-icons/CalendarArrowRight";
import Flag from "@cobuild/ui/pixel-icons/Flag";
import SvgPlus from "@cobuild/ui/pixel-icons/Plus";
import Trophy from "@cobuild/ui/pixel-icons/Trophy";
import Zap from "@cobuild/ui/pixel-icons/Zap";
import { useRevolution } from "app/libs/useRevolution";
import { SidebarFilterItem } from "./SidebarFilterItem";
import SvgHeart from "@cobuild/ui/pixel-icons/Heart";

interface Props {
  filter: ICreationsFilter;
  userHasSubmissions: boolean;
}

const filters = (
  collectibleName: string,
  hasAuction: boolean,
): Array<{
  filter: ICreationsFilter;
  title: string;
  description: string;
  icon: Icon;
}> => [
  {
    filter: "next-up",
    title: "Next up",
    description: `Help pick the next ${collectibleName}.`,
    icon: Zap,
  },
  {
    filter: "recent",
    title: "Recent",
    description: "The latest creations from the community.",
    icon: CalendarArrowRight,
  },
  {
    filter: "auctioned",
    title: hasAuction ? "Auctioned" : "Dropped",
    description: `All the ${collectibleName} that have been ${hasAuction ? "auctioned" : "dropped"}.`,
    icon: Trophy,
  },
  {
    filter: "hidden",
    title: "Flagged",
    description: "Creations flagged for not meeting the requirements.",
    icon: Flag,
  },
  {
    filter: "mine",
    title: "Mine",
    description: "Your beautiful creations.",
    icon: SvgHeart,
  },
];

export const CreationsSidebar = (props: Props) => {
  const { filter, userHasSubmissions } = props;
  const { isAuthenticated, login } = useUser();
  const { cultureIndex, descriptor, collectibleName, hasAuction } = useRevolution();
  const [_, setShowCreateModal] = useUrlState("create");

  return (
    <div className="hidden lg:sticky lg:top-0 lg:z-[2] lg:flex lg:h-screen lg:flex-col lg:justify-between lg:pt-24">
      <div>
        <div className="flex-col justify-start">
          <h1 className="dark:text-lead-100 text-lg font-bold">
            {cultureIndex?.name || "Art Race"}
          </h1>
          <div className="mt-1.5 overflow-hidden whitespace-pre-line text-balance pr-2.5 text-sm text-zinc-700 dark:text-zinc-300">
            <Markdown>
              {cultureIndex?.description || "Help the community decide the next featured creation."}
            </Markdown>
          </div>
        </div>
        <div className="mt-8 space-y-2.5">
          {/* if doesn't have submissions, filter out "mine" filter */}
          {filters(collectibleName, hasAuction)
            .filter(f => userHasSubmissions || f.filter !== "mine")
            .map(f => (
              <SidebarFilterItem {...f} key={f.filter} isActive={filter === f.filter} />
            ))}
        </div>
      </div>
      {cultureIndex && (
        <div className="pb-6">
          <Button
            size="lg"
            fullWidth
            onClick={() => {
              if (!isAuthenticated) {
                return login();
              }
              setShowCreateModal("true");
            }}
          >
            <SvgPlus className="mr-1 h-4 w-4" /> Create
            {descriptor ? " the next " + descriptor.tokenNamePrefix : ""}
          </Button>
        </div>
      )}
    </div>
  );
};
