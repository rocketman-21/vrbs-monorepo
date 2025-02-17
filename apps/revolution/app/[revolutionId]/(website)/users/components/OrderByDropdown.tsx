import { Dropdown, DropdownItem } from "@cobuild/ui/atoms/Dropdown";
import ArrowDown from "@cobuild/ui/pixel-icons/ArrowDown";
import Link from "next/link";

interface Props {
  searchParams: {
    filter: string | undefined;
    orderBy: string;
  };
}

const options = [
  { label: "Earned for DAO", value: "daoEarned" },
  { label: "Total earned", value: "totalEarned" },
  { label: "Username", value: "username" },
] as const;

export const OrderByDropdown = (props: Props) => {
  const { orderBy, filter } = props.searchParams;

  const selectedOption = options.find(o => o.value === orderBy)!!;

  return (
    <Dropdown
      button={
        <button className="group flex items-center">
          <span className="group-hover:text-lead-500 dark:hover:text-lead-300 font-medium tracking-tighter text-zinc-700 duration-100 dark:text-zinc-200">
            {selectedOption.label}
          </span>
          <ArrowDown className="ml-1.5 size-4 text-zinc-500 dark:text-zinc-300" />
        </button>
      }
    >
      {options.map(o => (
        <Link key={o.value} href={`?orderBy=${o.value}${filter ? `&filter=${filter}` : ""}`}>
          <DropdownItem>
            <span className="tracking-tight">Sort by {o.label}</span>
          </DropdownItem>
        </Link>
      ))}
    </Dropdown>
  );
};

type OrderValue = (typeof options)[number]["value"];

export function parseOrderBy(orderBy: string | undefined): OrderValue {
  return options.find(o => o.value === orderBy) ? (orderBy as OrderValue) : "daoEarned";
}
