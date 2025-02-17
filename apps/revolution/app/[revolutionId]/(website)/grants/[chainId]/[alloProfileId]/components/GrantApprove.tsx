"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { deleteCacheResult } from "@cobuild/libs/cache";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { getChain } from "@cobuild/libs/web3/utils";
import { revolutionGrantsAbi } from "@cobuild/revolution";
import { Button } from "@cobuild/ui/atoms/Button";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { useContractWrite } from "app/libs/useContractWrite";
import { useRouter } from "next/navigation";

interface Props {
  grant: Serialized<IGrant>;
}

export function GrantApprove(props: Props) {
  const { grant } = props;
  const router = useRouter();
  const { user, votingPower } = useUser();

  const contract = grant.parentGrantsContract as `0x${string}`;

  const { write, status } = useContractWrite({
    chainId: grant.chainId,
    contract,
    type: "claimGrant",
    successText: "Approved!",
    waitingText: "Approving...",
    onSuccess: async () => {
      await deleteCacheResult(
        `approvedRecipients_${grant.salaryRecipientAddress}_${grant.chainId}`,
      );
      setTimeout(() => router.refresh(), 500);
    },
  });

  const hasEnoughVotes = votingPower >= BigInt(1e18 * 1000);

  return (
    <div>
      <h3 className="font-medium">Grant approval</h3>
      <p className="mt-1.5 text-sm text-zinc-500 lg:pr-12">
        The grant is currently in the idea stage and is not open for voting.
      </p>
      <div className="mt-2.5">
        <Tooltip title={hasEnoughVotes ? "Approve this grant" : "You need 1000 votes"}>
          <Button
            disabled={status !== "idle" || !hasEnoughVotes}
            onClick={async () =>
              await write(client => {
                return client.simulateContract({
                  account: user ?? undefined,
                  address: contract,
                  abi: revolutionGrantsAbi,
                  chain: getChain(grant.chainId),
                  functionName: "addApprovedRecipient",
                  args: [grant.salaryRecipientAddress],
                });
              })
            }
            color="outline"
          >
            Approve Grant
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
