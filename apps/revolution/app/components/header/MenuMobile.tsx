"use client";

import { Dropdown } from "@cobuild/ui/atoms/Dropdown";
import Menu from "@cobuild/ui/pixel-icons/Menu";
import { useRevolution } from "app/libs/useRevolution";
import Link from "next/link";
import { useMenuOptions } from "./useMenuOptions";

export function MenuMobile() {
  const menuOptions = useMenuOptions();
  const { revolutionId } = useRevolution();

  return (
    <div className="md:hidden">
      <Dropdown
        button={
          <button className="header-overlay:text-white flex items-center dark:text-white">
            <Menu className="ml-2.5 h-6 w-6" />
          </button>
        }
      >
        {menuOptions.map(({ url, name, icon, isExternal }) => (
          <Link
            key={`mob_${url}`}
            href={!isExternal ? `/${revolutionId}/${url}` : url}
            target={isExternal ? "_blank" : undefined}
          >
            <Dropdown.Item icon={icon}>{name}</Dropdown.Item>
          </Link>
        ))}
      </Dropdown>
    </div>
  );
}
