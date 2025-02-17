import "server-only";

import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getShortEthAddress } from "@cobuild/libs/utils/account";
import { etherscanNetworkUrl, openseaNftUrl } from "@cobuild/libs/utils/url";
import { getNetworkLogoUrl, getNetworkName } from "@cobuild/libs/web3/utils";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { DateRelative } from "@cobuild/ui/atoms/DateRelative";
import { Ether } from "@cobuild/ui/atoms/Ether";
import { Scrollable } from "@cobuild/ui/atoms/Scrollable";
import SvgExternalLink from "@cobuild/ui/pixel-icons/ExternalLink";
import { Votes } from "app/components/Votes";
import { UserProfile } from "app/components/user-profile/UserProfile";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  revolutionId: string;
}

export async function Payments(props: Props) {
  const { revolutionId } = props;

  const [transactions, revolution] = await Promise.all([
    Revolutions().fundingTransactions(revolutionId),
    Revolutions().getById(revolutionId),
  ]);

  if (!revolution || !revolution.addresses) return notFound();

  return (
    <section className="bg-secondary-50 dark:bg-secondary-200 max-w-full overflow-hidden rounded-2xl px-4 py-16 lg:px-6 dark:text-black">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-xl font-bold leading-7 lg:text-3xl dark:text-black">
          Consistent funding
        </h2>
        <p className="mt-2.5 max-w-2xl text-zinc-500 dark:text-zinc-700">
          Our support for {revolution.name} builders is fully transparent and decentralized. We all
          decide who to fund.
        </p>
        <Scrollable horizontal className="mt-12">
          <table>
            <colgroup>
              <col className="w-full sm:w-4/12" />
              <col className="lg:w-3/12" />
              <col className="lg:w-2/12" />
              <col className="lg:w-2/12" />
              <col className="lg:w-1/12" />
            </colgroup>
            <thead className="border-b border-white/10 text-left text-sm">
              <tr>
                <th scope="col" className="py-2 pr-8 font-semibold">
                  Supporter
                </th>
                <th scope="col" className="py-2 pr-8 font-semibold">
                  Purchase
                </th>
                <th scope="col" className="py-2 pr-8 font-semibold lg:pr-20">
                  To DAO
                </th>
                <th scope="col" className="py-2 pr-8 font-semibold lg:pr-20">
                  To Grants
                </th>
                <th scope="col" className="py-2 pr-8 font-semibold max-sm:hidden">
                  Transaction
                </th>
                <th
                  scope="col"
                  className="py-2 pr-4 text-right font-semibold max-sm:hidden lg:pr-8"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {transactions.map(item => (
                <tr key={`${item.transactionHash}_${item.date}`}>
                  <td className="py-4 pr-8">
                    <div className="flex items-center gap-x-4">
                      <Avatar
                        id={item.transactionHash}
                        imageUrl={item.profile?.profilePicture}
                        name={item.profile?.username || item.transactionHash}
                        className="h-8 w-8 rounded-full bg-zinc-800"
                        size="32"
                      />
                      <UserProfile
                        address={item.buyer as `0x${string}`}
                        profile={item.profile}
                        revolutionId={revolutionId}
                        withPopover
                      >
                        {profile => (
                          <Link
                            href={`/${revolutionId}/users/${profile.username}`}
                            className="text-left"
                          >
                            <h5 className="truncate text-sm font-medium hover:underline">
                              {profile.displayUsername}
                            </h5>
                            <div className="mt-0.5 text-xs text-zinc-700 sm:hidden">
                              <DateRelative date={item.date} />
                            </div>
                          </Link>
                        )}
                      </UserProfile>
                    </div>
                  </td>

                  {item.purchase.points && (
                    <td className="py-4 pr-8 text-sm text-zinc-700 lg:pr-16">
                      <Votes>{item.purchase.points}</Votes> votes
                    </td>
                  )}

                  {item.purchase.auctionItem && (
                    <td className="py-4 pr-8 text-sm leading-6 text-zinc-700 lg:pr-16">
                      <a
                        className="flex flex-row items-center space-x-2 hover:underline"
                        target="_blank"
                        href={openseaNftUrl(
                          revolution.addresses?.token || "0x",
                          item.purchase.auctionItem.tokenId,
                          revolution.chainId,
                        )}
                      >
                        <Image
                          src={item.purchase.auctionItem.imageUrl}
                          alt={item.purchase.auctionItem.name}
                          width={24}
                          height={24}
                          className="rounded-lg"
                        />
                        <span>{item.purchase.auctionItem.name}</span>
                      </a>
                    </td>
                  )}

                  <td className="py-4 pr-8 text-sm leading-6 text-zinc-700 lg:pr-16">
                    <Ether amount={BigInt(item.toDao)} symbol="Ξ" />
                  </td>

                  <td className="py-4 pr-8 text-sm leading-6 text-zinc-700 lg:pr-16">
                    <Ether amount={BigInt(item.toGrants)} symbol="Ξ" />
                  </td>

                  <td className="hidden py-4 pl-0 pr-8 sm:table-cell sm:pr-16">
                    <div className="flex items-center space-x-2.5">
                      <Image
                        src={getNetworkLogoUrl(item.chainId)}
                        alt={getNetworkName(item.chainId)}
                        width={16}
                        height={16}
                      />
                      <a
                        href={etherscanNetworkUrl(item.transactionHash, item.chainId)}
                        target="_blank"
                        className="inline-flex items-center text-sm text-zinc-700 hover:underline"
                      >
                        {getShortEthAddress(item.transactionHash)}
                        <SvgExternalLink className="ml-2.5 h-3.5 w-3.5 opacity-75" />
                      </a>
                    </div>
                  </td>

                  <td className="hidden py-4 pr-4 text-right text-sm leading-6 text-zinc-700 sm:table-cell sm:pr-6 lg:pr-8">
                    <DateRelative date={item.date} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Scrollable>
      </div>
    </section>
  );
}
