"use client";

import { useRevolution } from "app/libs/useRevolution";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useMenuOptions } from "./useMenuOptions";

export function MenuDesktop() {
  const { revolutionId } = useRevolution();
  const menuOptions = useMenuOptions();

  const pathname = usePathname();
  const currentMenuOption = useMemo(() => pathname.split("/")[2], [pathname]) || "";

  return (
    <div className="hidden items-center space-x-7 md:flex">
      {menuOptions
        .filter(m => m.onlyMobile !== true)
        .map(({ url, name, isExternal }) => (
          <Link
            key={`des_${name}`}
            className={classNames(
              "hidden text-sm font-medium md:inline-block lg:text-base",
              "hover:text-lead-500 dark:hover:text-lead-300 header-overlay:text-white hover:header-overlay:text-lead-200 duration-150 dark:text-white",
              {
                "decoration-lead-500 dark:decoration-lead-300 underline decoration-2 underline-offset-8":
                  currentMenuOption === url,
              },
            )}
            target={isExternal ? "_blank" : undefined}
            href={!isExternal ? `/${revolutionId}/${url}` : url}
          >
            {name}
          </Link>
        ))}
    </div>
  );
}
