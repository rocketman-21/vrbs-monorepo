"use client";

import { useScrollPosition } from "@cobuild/libs/hooks/useScrollPosition";
import cx from "classnames";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { HorizontalMenu } from "@cobuild/ui/atoms/HorizontalMenu";
import ArrowLeft from "@cobuild/ui/pixel-icons/ArrowLeft";

const items = [
  { name: "Draft", slug: "draft" },
  { name: "Discussion", slug: "discussion" },
  { name: "Manage", slug: "manage" },
] as const;

export type IDraftTab = (typeof items)[number]["slug"];

interface Props {
  returnUrl: string;
  defaultTab: IDraftTab;
  isHidden?: boolean;
}

export const DraftMobileMenu = (props: Props) => {
  const { returnUrl, defaultTab, isHidden } = props;
  const pathname = usePathname();
  const { scrollPosition } = useScrollPosition();
  const [activeTab, setActiveTab] = useState<IDraftTab>(defaultTab);
  const router = useRouter();
  const [_, startTransition] = useTransition();

  const changeTab = (tab: IDraftTab) => {
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
