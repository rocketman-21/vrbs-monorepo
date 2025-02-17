import { IContest } from "@cobuild/database/models/revolution/contests/IContest";
import clsx from "classnames";

export const ContestStatus = (props: { status: IContest["status"] }) => {
  const { status } = props;

  return (
    <span className="inline-flex items-center text-[13px] font-medium">
      <span
        className={clsx("mr-1.5 inline-block size-2 rounded-full", {
          "bg-green-500": status === "active",
          "bg-yellow-300": status === "upcoming",
          "bg-blue-500": status === "ended",
        })}
      />
      {status}
    </span>
  );
};
