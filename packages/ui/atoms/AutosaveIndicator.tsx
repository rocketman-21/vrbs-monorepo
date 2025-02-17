import classNames from "classnames";
import { Tooltip } from "./Tooltip/Tooltip";

interface Props {
  hasChanges: boolean;
  isUpdating?: boolean;
}

export const AutosaveIndicator = (props: Props) => {
  const { hasChanges, isUpdating } = props;

  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-1">
      <Tooltip subtitle={hasChanges ? "Unsaved changes" : `Changes saved`}>
        <div
          className={classNames("h-2.5 w-2.5 rounded-full", {
            "bg-red-500 dark:bg-red-400": hasChanges,
            "bg-green-500 dark:bg-green-400": !hasChanges,
            "animate-pulse": isUpdating,
          })}
        />
      </Tooltip>
    </div>
  );
};
