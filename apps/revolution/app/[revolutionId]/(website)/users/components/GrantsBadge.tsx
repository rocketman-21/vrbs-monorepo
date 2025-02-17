import { IGrant } from "@cobuild/database/types";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";

interface Props {
  grants: IGrant[];
}

export const GrantsBadge = (props: Props) => {
  const { grants } = props;

  if (grants.length === 0) return null;

  const label = grants.length === 1 ? grants[0].title : `${grants.length} grants`;

  return (
    <Tooltip className="inline-flex" subtitle={grants.map(g => g.title).join("\n")}>
      <span className="bg-secondary-200 text-secondary-950 max-w-48 overflow-hidden truncate whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium tracking-tighter">
        {label}
      </span>
    </Tooltip>
  );
};
