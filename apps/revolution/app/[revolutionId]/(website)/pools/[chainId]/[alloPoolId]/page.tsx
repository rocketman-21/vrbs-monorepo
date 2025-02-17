import { Pools } from "@cobuild/database/models/revolution/pools/Pools";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Markdown } from "@cobuild/ui/atoms/Markdown";
import { Tag } from "@cobuild/ui/atoms/Tag";
import Anchor from "@cobuild/ui/pixel-icons/Anchor";
import Discussion from "app/components/Discussion/Discussion";
import SmartContractItem from "app/components/contracts/SmartContractItem";
import { UserProfile } from "app/components/user-profile/UserProfile";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PoolBalance } from "./components/PoolBalance";

interface Props {
  params: {
    revolutionId: string;
    chainId: string;
    alloPoolId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { revolutionId, alloPoolId, chainId } = params;
  const { name: revolutionName } = getRevolutionConfig(revolutionId);

  const pool = await Pools().getById(alloPoolId, parseInt(chainId));
  if (!pool) notFound();

  return {
    title: `${pool.title} | ${revolutionName} Pools`,
    description: pool.body,
  };
}

export default async function PoolSinglePage(props: Props) {
  const { revolutionId, alloPoolId, chainId } = props.params;

  const pool = await Pools().getById(alloPoolId, parseInt(chainId));

  if (!pool || pool.revolutionId !== revolutionId) return notFound();

  return (
    <main>
      <section className="mb-40 mt-20 px-4 pb-20 md:mt-32 lg:px-6">
        <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-8 lg:gap-28">
          <div className="md:col-span-5">
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5 md:space-x-6">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl md:h-20 md:w-20">
                  <Image
                    className="object-cover"
                    src={pool.imageUrl}
                    alt={pool.title}
                    width={80}
                    height={80}
                  />
                </div>
                <div className="grow">
                  <h1 className="text-2xl font-bold md:text-4xl dark:text-white">{pool.title}</h1>
                </div>
              </div>
              {pool.tags.length > 0 && (
                <div className="flex space-x-2.5">
                  {pool.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}
            </div>

            <div className="prose prose-a:text-lead-500 dark:prose-a:text-lead-300 prose-a:break-all mt-6 max-w-none text-base md:text-lg lg:mt-8 dark:text-white">
              <Markdown>{pool.body.toString() || ""}</Markdown>
            </div>

            <div className="mt-6 lg:mt-12">
              <h3 className="dark:text-lead-100 mb-6 text-xl font-bold tracking-tight md:text-2xl">
                Discussion
              </h3>
              <Discussion scope={{ id: pool.alloPoolId, type: "allo_pool" }} />
            </div>
          </div>

          <div className="col-span-1 md:col-span-3">
            <div className="space-y-6 md:sticky md:top-24">
              <div>
                <h3 className="font-bold">Managers</h3>
                <div className="mt-2.5 grid grid-cols-1 gap-2.5">
                  {pool.managers.map(address => (
                    <UserProfile
                      address={address}
                      key={address}
                      revolutionId={revolutionId}
                      withPopover
                    >
                      {({ username, profilePicture, displayUsername }) => (
                        <div className="flex items-center space-x-2.5 rounded-xl border border-zinc-300 p-3">
                          <Avatar id={address} size={36} imageUrl={profilePicture} />
                          <div className="flex max-w-full flex-row space-x-2 truncate">
                            <div className="hover:text-lead-600 text-[15px] font-medium">
                              {displayUsername}
                            </div>
                            {pool.ownerProfile.owner.toLowerCase() === address.toLowerCase() && (
                              <div className="bg-lead-200 group flex flex-row items-center space-x-1.5 rounded-full px-2">
                                <Anchor className="h-3.5 w-3.5" />
                                <span className="hidden text-xs font-medium text-black group-hover:inline-block dark:text-white">
                                  Owner
                                </span>
                              </div>
                            )}
                            {/* <div className="mt-0.5 text-xs opacity-50">bio</div> */}
                          </div>
                        </div>
                      )}
                    </UserProfile>
                  ))}
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <h3 className="font-bold">Details</h3>
                <PoolBalance
                  poolId={parseInt(pool.alloPoolId)}
                  chainId={pool.chainId}
                  address={pool.strategy}
                />
                <div className="flex flex-col justify-start space-y-2 py-4">
                  <SmartContractItem
                    title="Strategy"
                    address={pool.strategy}
                    description="The Allo pool strategy contract"
                    condensed
                    chainId={pool.chainId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <Payments revolutionId={pool.revolutionId} /> */}
    </main>
  );
}
