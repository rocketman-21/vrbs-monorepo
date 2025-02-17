import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import SvgSun from "@cobuild/ui/pixel-icons/Sun";

export const OpportunitiesBadge = () => {
  return (
    <Tooltip title="Join and Contribute" subtitle="Get paid for your effort">
      <span className="bg-secondary-200 text-secondary-950 mb-1 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium leading-none">
        <SvgSun className="mr-1 size-4" />
        Help wanted
      </span>
    </Tooltip>
  );
};
