import "server-only";

import { Splits } from "@cobuild/database/models/revolution/splits/Splits";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { Votes } from "app/components/Votes";

interface Props {
  entityName: string;
  splitsCreator: `0x${string}`;
  chainId: number;
  controller?: string;
}

export const SplitStats = async (props: Props) => {
  const { splitsCreator, chainId, entityName, controller } = props;

  const stats = await Splits().getStats(splitsCreator, chainId, controller);

  return (
    <>
      <p>
        {entityName} has split <Ether amount={BigInt(stats.ethEarned?.total || "0")} /> Ξ with{" "}
        {stats.uniqueAccounts} {stats.uniqueAccounts === 1 ? "person" : "people"}.
      </p>
      <p>
        Our treasury earned <Ether amount={BigInt(stats.ethEarned?.dao || "0")} /> Ξ
        {!controller ? (
          <>
            , and people earned <Votes>{stats.pointsEarned || "0"}</Votes> votes.
          </>
        ) : (
          <> thanks to {entityName}.</>
        )}
      </p>
    </>
  );
};
