"use client";

import { HorizontalMenu } from "@cobuild/ui/atoms/HorizontalMenu";
import ArrowLeft from "@cobuild/ui/pixel-icons/ArrowLeft";
import { useScrollPosition } from "@cobuild/libs/hooks/useScrollPosition";
import cx from "classnames";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const items = [
  { name: "Proposal", slug: "proposal" },
  { name: "Discussion", slug: "discussion" },
  { name: "Voting", slug: "voting" },
] as const;

export type IProposalTab = (typeof items)[number]["slug"];

interface Props {
  returnUrl: string;
  defaultTab: IProposalTab;
  isHidden?: boolean;
}

export const ProposalMobileMenu = (props: Props) => {
  const { returnUrl, defaultTab, isHidden } = props;
  const pathname = usePathname();
  const { scrollPosition } = useScrollPosition();
  const [activeTab, setActiveTab] = useState<IProposalTab>(defaultTab);
  const router = useRouter();
  const [_, startTransition] = useTransition();

  const changeTab = (tab: IProposalTab) => {
    setActiveTab(tab);
    startTransition(() => {
      router.replace(pathname + "?tab=" + tab);
    });
  };

  return (
    <div
      className={cx("sticky top-0 z-40 block p-4 duration-150 lg:hidden", {
        "bg-card shadow": scrollPosition > 64,
        hidden: isHidden,
      })}
    >
      <div className="flex items-center">
        <Link href={returnUrl}>
          <ArrowLeft width="16" height="16" className="mr-2.5" />
        </Link>
        <HorizontalMenu size="lg">
          {items.map(item => (
            <HorizontalMenu.Item
              isActive={activeTab === item.slug}
              key={`sm_${item.slug}`}
              onClick={() => changeTab(item.slug)}
            >
              {item.name}
            </HorizontalMenu.Item>
          ))}
        </HorizontalMenu>
      </div>
    </div>
  );
};
