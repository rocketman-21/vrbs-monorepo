import "server-only";

import { IGrant } from "@cobuild/database/types";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { getGrantsDonations } from "@cobuild/libs/web3/explorer-api/explorerApi";
import { Suspense } from "react";
import { GrantsBalanceETH } from "./GrantsBalanceETH";
import { GrantsBalanceUSDC } from "./GrantsBalanceUSDC";
import { GrantsDonate } from "./GrantsDonate";

interface Props {
  grant: IGrant;
}

export const GrantDonations = async (props: Props) => {
  const { grant } = props;

  const { poolBalance, alloProfile } = grant;

  const user = await getUser(grant.revolutionId);
  const isOwner = user && alloProfile.owner === user;

  return (
    <div className="flex flex-col">
      <h3 className="mb-2.5 font-medium">Sponsors</h3>
      {isOwner && (poolBalance.ethBalance > 0 || poolBalance.usdcBalance > 0) && (
        <div className="mb-5 mt-2.5 flex space-x-4">
          {poolBalance.ethBalance > 0 && <GrantsBalanceETH grant={serializeSync(grant)} />}
          {poolBalance.usdcBalance > 0 && <GrantsBalanceUSDC grant={serializeSync(grant)} />}
        </div>
      )}
      <Suspense>
        <GrantsDonate
          donations={await getGrantsDonations({
            address: grant.salaryRecipientAddress,
            chainId: grant.chainId,
          })}
          grant={serializeSync(grant)}
        />
      </Suspense>
    </div>
  );
};
