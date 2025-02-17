import { IGrant } from "@cobuild/database/types";
import { serializeSync } from "@cobuild/database/utils";
import { isAdmin } from "@cobuild/libs/revolution/admin";
import { getUser } from "@cobuild/libs/user/server";
import Skeleton from "@cobuild/ui/atoms/Skeleton";
import { UserProfile } from "app/components/user-profile/UserProfile";
import pluralize from "pluralize";
import { Suspense } from "react";
import { GrantApplicationButton } from "../../../components/GrantApplicationButton";
import { GrantApplicationDetails } from "./GrantApplicationDetails";

interface Props {
  grant: IGrant;
}

export async function GrantApplicants(props: Props) {
  const { grant } = props;
  const { openings, maxOpenings } = grant;

  const applicants = grant.subgrants();

  const user = await getUser(grant.revolutionId);
  const canManage = grant.canBeManagedBy(user);

  return (
    <div className="flex flex-col">
      <h3 className="mb-2.5 font-medium">Applications</h3>

      <p className="text-sm text-zinc-500">
        {maxOpenings > 0 && (
          <>
            {openings} of {maxOpenings} {pluralize("opening", maxOpenings)} available.{" "}
            <Suspense>{(await applicants).length}</Suspense>{" "}
            {pluralize("user", (await applicants).length)} applied so far
          </>
        )}
      </p>

      <div className="my-4 space-y-5">
        <Suspense fallback={<Skeleton count={3} rounded height={36} />}>
          {(await applicants).map(application => (
            <UserProfile
              address={application.team[0]}
              revolutionId={grant.revolutionId}
              key={application.alloProfileId}
            >
              {profile => (
                <GrantApplicationDetails
                  profile={profile}
                  application={serializeSync(application)}
                  canApprove={canManage && openings > 0}
                />
              )}
            </UserProfile>
          ))}
        </Suspense>
      </div>

      {openings > 0 && (
        <GrantApplicationButton grant={serializeSync(grant)} fullWidth size="lg">
          Apply for this grant
        </GrantApplicationButton>
      )}
    </div>
  );
}
