import "server-only";

import { IGrant } from "@cobuild/database/types";
import { serialize, serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { SidebarStat } from "app/components/SidebarStat";
import { Votes } from "app/components/Votes";
import { Suspense } from "react";
import { GrantBudget } from "./GrantBudget";
import { GrantClaimBalance } from "./GrantClaimBalance";
import { GrantTotalEarned } from "./GrantTotalEarned";

interface Props {
  grant: IGrant;
}

export const GrantFunding = async (props: Props) => {
  const { grant } = props;
  const { alloProfile, isOpenGrantPool, revolutionId, isApproved } = grant;

  const user = await getUser(revolutionId);
  const isOwner = user && alloProfile.owner === user;
  const userVotes = user ? grant.userVotes(user) : undefined;

  return (
    <>
      <div>
        <h3 className="font-medium">Funding</h3>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <GrantBudget grant={grant} />

          {!isOpenGrantPool && <GrantTotalEarned grant={serializeSync(grant)} />}

          {!isOpenGrantPool && isOwner && (
            <GrantClaimBalance grant={await serialize(grant, ["isMemberConnectedToPool"])} />
          )}

          {user && (
            <SidebarStat label="Your Vote">
              <Suspense fallback="...">
                <Votes>{(await userVotes) || 0}</Votes>
              </Suspense>
            </SidebarStat>
          )}
        </div>
      </div>
    </>
  );
};
