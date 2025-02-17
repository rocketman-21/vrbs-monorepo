import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { Pools } from "@cobuild/database/models/revolution/pools/Pools";
import { serializeMany, serializeSync } from "@cobuild/database/utils";
import { cacheResult } from "@cobuild/libs/cache";
import { logTime } from "@cobuild/libs/log-time";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { getUser } from "@cobuild/libs/user/server";
import { getAbsoluteUrl } from "@cobuild/libs/utils/url";
import { Button } from "@cobuild/ui/atoms/Button";
import { Markdown } from "@cobuild/ui/atoms/Markdown";
import { Tag } from "@cobuild/ui/atoms/Tag";
import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GrantBreadcrumbs } from "../../components/GrantBreadcrumbs";
import { SubgrantsList } from "../../components/SubgrantsList";
import { GrantApplicants } from "./components/GrantApplicants";
import { GrantApprove } from "./components/GrantApprove";
import { GrantDonations } from "./components/GrantDonations";
import { GrantFunding } from "./components/GrantFunding";
import { GrantImage } from "./components/GrantImage";
import { GrantTeam } from "./components/GrantTeam";

export const maxDuration = 120;

interface Props {
  params: {
    revolutionId: string;
    alloProfileId: string;
    chainId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { revolutionId, alloProfileId, chainId } = params;
  const { name: revolutionName } = getRevolutionConfig(revolutionId);

  const currentTime = Date.now();
  const [grant, otherMetadata] = await Promise.all([
    Grants().getById(alloProfileId, parseInt(chainId)),
    cacheResult(`metadata_${revolutionId}_${chainId}_${alloProfileId}`, 600, async () =>
      fetchMetadata(getAbsoluteUrl(`/${revolutionId}/grants/${chainId}/${alloProfileId}/frame`)),
    ),
  ]);
  logTime("Grant Page Metadata", currentTime);

  if (!grant) notFound();

  return {
    title: `${grant.title} | ${revolutionName} Grants`,
    description: grant.tagline,
    other: otherMetadata,
  };
}

export default async function GrantSinglePage(props: Props) {
  const { revolutionId, alloProfileId, chainId } = props.params;

  const [grant, user] = await Promise.all([
    Grants().getById(alloProfileId, parseInt(chainId)),
    getUser(revolutionId),
  ]);

  if (!grant || grant.revolutionId !== revolutionId) return notFound();

  const revolution = getRevolutionConfig(revolutionId);

  const { isOpenGrantPool, tags, contractAddress, isApproved, isApplicable, isApplication } = grant;

  const canManage = grant.canBeManagedBy(user);

  return (
    <main>
      <section className="mt-20 px-4 pb-12 md:mt-32 lg:px-6">
        <div className="mx-auto grid w-full max-w-full grid-cols-1 gap-8 md:max-w-7xl md:grid-cols-8 lg:gap-x-28 lg:gap-y-12">
          <div className="md:col-span-5">
            <GrantBreadcrumbs grant={grant} />

            <div className="mt-6 flex items-center space-x-2.5 md:space-x-6">
              <GrantImage
                canManage={canManage}
                imageUrl={grant.imageUrl}
                alloProfileId={alloProfileId}
                chainId={Number(chainId)}
              />
              <div className="grow">
                <h1 className="text-balance text-2xl font-medium md:text-3xl dark:text-white">
                  {grant.title}
                </h1>
                <h2 className="mt-0.5 max-w-xl text-xs text-zinc-600 md:text-lg dark:text-zinc-200">
                  {grant.tagline}
                </h2>
              </div>
            </div>
            {tags.length > 0 && (
              <div className="mt-4 flex space-x-2.5">
                {tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            )}
            <div className="prose prose-a:text-lead-500 dark:prose-a:text-lead-300 prose-a:break-all hover:prose-a:text-lead-700 mt-6 max-w-none text-base duration-100 lg:mt-8 dark:text-white">
              <Markdown>{grant.body.toString() || ""}</Markdown>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3">
            <div className="space-y-6 md:sticky md:top-6 md:pb-6">
              <GrantTeam grant={grant} />

              {isApproved && <GrantFunding grant={grant} />}

              {isApproved && <GrantDonations grant={grant} />}

              {isApproved && isApplicable && <GrantApplicants grant={grant} />}

              {!isApproved && !isApplication && <GrantApprove grant={serializeSync(grant)} />}
            </div>
          </div>

          {isOpenGrantPool && contractAddress && isApproved && (
            <div className="max-sm:-mx-4 md:col-span-8">
              <Suspense>
                <SubgrantsList
                  parentGrant={serializeSync(grant)}
                  grants={await serializeMany(await grant.subgrants(), ["members"])}
                  votes={user ? await Pools().getVotesForUser(user, contractAddress) : []}
                />
              </Suspense>
            </div>
          )}
        </div>
      </section>

      {!isOpenGrantPool && (
        <section className="bg-secondary-50 mt-24">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {revolution.name} Grants.
              <br />A program for dreamers.
            </h2>
            <div className="mt-10 flex gap-x-6 max-sm:flex-col max-sm:space-y-2.5 lg:items-center">
              <Link href={`/${revolutionId}/grants`}>
                <Button size="lg">{revolution.name} Grants &raquo;</Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
