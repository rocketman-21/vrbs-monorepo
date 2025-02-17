import { IGrant } from "@cobuild/database/types";
import { nonNullable } from "@cobuild/database/utils";
import { Dropdown, DropdownItem } from "@cobuild/ui/atoms/Dropdown";
import FilterIcon from "@cobuild/ui/pixel-icons/Label";
import uniq from "lodash/uniq";
import Link from "next/link";
import { getResidentLabel } from "./ResidencyBadge";

interface Props {
  filters: string[];
  searchParams: {
    filter: string | undefined;
    orderBy: string;
  };
}

export const FilterDropdown = (props: Props) => {
  const { searchParams, filters } = props;
  const { filter, orderBy } = searchParams;

  const selectedOption = filters.find(f => f === filter) || "All builders";

  return (
    <Dropdown
      placement="bottom-start"
      button={
        <button className="group flex items-center">
          <FilterIcon className="mr-1.5 size-4 text-zinc-500 dark:text-zinc-300" />
          <span className="group-hover:text-lead-500 dark:hover:text-lead-300 font-medium tracking-tighter text-zinc-700 duration-100 dark:text-zinc-200">
            {selectedOption}
          </span>
        </button>
      }
    >
      <Link href={`?orderBy=${orderBy}`}>
        <DropdownItem>All builders</DropdownItem>
      </Link>

      {filters.map(f => (
        <Link key={f} href={`?orderBy=${orderBy}&filter=${f}`}>
          <DropdownItem key={f}>{f}</DropdownItem>
        </Link>
      ))}
    </Dropdown>
  );
};

export const parseFilter = (filter: string | undefined, labels: string[]) => {
  if (!filter) return undefined;
  return labels.includes(filter) ? filter : undefined;
};

export function getResidencyFilters(grants: IGrant[]): string[] {
  return uniq(grants.map(g => getResidentLabel(g.title)).filter(g => !!g))
    .filter(nonNullable)
    .sort((a, b) => a.localeCompare(b));
}
