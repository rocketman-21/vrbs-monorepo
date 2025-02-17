import { IGrant, Serialized } from "@cobuild/database/types";
import { abbreviateNumber } from "@cobuild/libs/utils/numbers";
import SvgWallet from "@cobuild/ui/pixel-icons/Wallet";
import { AnimatedEarnings } from "app/components/AnimatedEarnings";
import Image from "next/image";
import Link from "next/link";
import { WithdrawEarnings } from "./WithdrawEarnings";
import { useState } from "react";
import { useUser } from "@cobuild/libs/hooks/useUser";
import classNames from "classnames";

interface Props {
  grants: Serialized<IGrant, "isMemberConnectedToPool">[];
}

export const EarningsTable = (props: Props) => {
  const { grants } = props;
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleWalletClick = (alloProfileId: string) => {
    setExpandedRow(expandedRow === alloProfileId ? null : alloProfileId);
  };

  const { user } = useUser();

  return (
    <table className="w-full">
      <thead>
        <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-400">
          <th className="whitespace-nowrap"></th>
          <th className="whitespace-nowrap pr-4 text-right font-medium">Earned</th>
          <th className="whitespace-nowrap pr-6 text-right font-medium">Claimable</th>
        </tr>
      </thead>
      <tbody>
        {grants.map(grant => (
          <>
            <tr key={grant.alloProfileId}>
              <td className="py-1.5 pr-4">
                <div className="flex items-center space-x-2.5">
                  <Image
                    src={grant.imageUrl}
                    alt={grant.title}
                    width="64"
                    height={64}
                    className="size-8 rounded-md"
                  />
                  <h3 className="line-clamp-1 text-xs md:text-sm">
                    <Link
                      href={grant.url}
                      className="hover:text-lead-500 dark:hover:text-lead-300 duration-100 ease-out"
                    >
                      {grant.title}
                    </Link>
                  </h3>
                </div>
              </td>
              <td className="pr-4 text-right text-xs md:text-sm">
                {grant.isApproved ? (
                  <span>${abbreviateNumber(Math.trunc(grant.poolBalance.totalEarned / 1e18))}</span>
                ) : (
                  <span className="text-zinc-400">Pending</span>
                )}
              </td>
              <td className="text-right text-xs md:text-sm">
                <div className="flex h-full flex-row items-center justify-end space-x-2">
                  {grant.isApproved ? (
                    <AnimatedEarnings
                      earnings={
                        // do this because claimable supertoken is 0 until connect pool is called
                        grant.poolBalance.superTokenBalance || grant.poolBalance.claimableBalance
                      }
                      flowRate={grant.memberFlowRate}
                    />
                  ) : (
                    <span className="text-zinc-400">Pending</span>
                  )}
                  <button
                    type="button"
                    className={classNames(
                      "text-lead-400 hover:text-lead-500 inline-flex text-xs duration-100",
                      {
                        "text-zinc-400":
                          !grant.isApproved ||
                          (grant.poolBalance.superTokenBalance ||
                            grant.poolBalance.claimableBalance) <= BigInt(10 ** 18),
                      },
                    )}
                    onClick={() => handleWalletClick(grant.alloProfileId)}
                  >
                    <SvgWallet className="size-[16px]" />
                  </button>
                </div>
              </td>
            </tr>
            {expandedRow === grant.alloProfileId && (
              <tr>
                <td colSpan={3} className="pb-3 pt-1">
                  <WithdrawEarnings
                    grant={grant}
                    initialValue={{
                      address: user,
                      amount: Math.trunc(grant.poolBalance.superTokenBalance / 1e18),
                    }}
                    chainId={grant.chainId}
                  />
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  );
};
