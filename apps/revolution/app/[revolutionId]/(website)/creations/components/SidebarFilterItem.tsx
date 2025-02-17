import * as motion from "@cobuild/ui/atoms/Motion";
import { Icon } from "@cobuild/ui/atoms/types";
import { ICreationsFilter } from "@cobuild/libs/revolution/interfaces";
import clsx from "classnames";
import Link from "next/link";

interface Props {
  filter: ICreationsFilter;
  title: string;
  description: string;
  icon: Icon;
  isActive: boolean;
}

export const SidebarFilterItem = (props: Props) => {
  const { filter, title, description, icon: Icon, isActive } = props;

  return (
    <Link
      href={`?filter=${filter}`}
      className={clsx("group block rounded-lg p-2.5 text-left duration-100 ease-in-out lg:p-3", {
        "bg-card hover:bg-lead-100 dark:hover:bg-zinc-800": !isActive,
        "bg-lead-100 dark:bg-zinc-800 dark:text-white": isActive,
      })}
    >
      <div className="flex items-center space-x-1.5 pr-2">
        <Icon className="h-4 w-4" />
        <h4 className="text-[15px] font-medium">{title}</h4>
      </div>

      <motion.div
        variants={{
          hidden: { height: 0, marginTop: 0 },
          visible: { height: 40, marginTop: "4px" },
        }}
        initial={isActive ? "visible" : "hidden"}
        animate={isActive ? "visible" : "hidden"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden text-[13px] text-zinc-600 will-change-auto dark:text-zinc-400"
      >
        {description}
      </motion.div>
    </Link>
  );
};
