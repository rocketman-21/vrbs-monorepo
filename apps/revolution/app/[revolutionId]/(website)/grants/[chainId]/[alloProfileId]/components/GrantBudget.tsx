import "server-only";

import { IGrant } from "@cobuild/database/types";
import { serializeSync } from "@cobuild/database/utils";
import { isAdmin } from "@cobuild/libs/revolution/admin";
import { getUser } from "@cobuild/libs/user/server";
import { SidebarStat } from "app/components/SidebarStat";
import { formatEther } from "viem";
import { GrantsConnectContract } from "./GrantsConnectContract";

interface Props {
  grant: IGrant;
}

export async function GrantBudget(props: Props) {
  const { grant } = props;
  const { monthlyFlowRate, isOpenGrantPool, revolutionId, alloProfile } = grant;

  const user = await getUser(revolutionId);
  const isOwner = user && alloProfile.owner === user;
  const showConnectBtn =
    isOpenGrantPool &&
    (isAdmin(user, grant.revolutionId) || isOwner) &&
    !(await grant.isMemberConnectedToPool());

  // managed by curtis coffee
  const isCommunityManagedBudget =
    grant.alloProfileId === "0x2f0ba71fe57ee03e7f79e77c1088a9a82cacfdd1e3ac0abf8f1fc067d41cc650";

  return (
    <SidebarStat
      label={isOpenGrantPool ? "Budget" : "Salary"}
      action={showConnectBtn ? <GrantsConnectContract grant={serializeSync(grant)} /> : undefined}
    >
      {!isCommunityManagedBudget ? (
        <span>
          {Intl.NumberFormat("en", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(Number(formatEther(BigInt(monthlyFlowRate))))}
        </span>
      ) : (
        <>$150</>
      )}
      <span className="text-sm">/month</span>
    </SidebarStat>
  );
}
