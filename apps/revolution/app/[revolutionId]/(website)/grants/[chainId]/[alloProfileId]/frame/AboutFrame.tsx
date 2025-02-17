import { Profiles } from "@cobuild/database/models/social/Profiles";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { getPalette } from "@cobuild/libs/revolution/palette";
import { getAbsoluteUrl } from "@cobuild/libs/utils/url";
import pluralize from "pluralize";
import { AlloProfile as Grant } from "prisma-database";

export async function getAboutFrame(grant: Grant) {
  const profiles = await Profiles().getMany(grant.team as `0x${string}`[]);
  const revolution = getRevolutionConfig(grant.revolutionId);

  const { colorPalette } = revolution;

  const lead = getPalette(colorPalette.lead);
  const secondary = colorPalette.secondary ? getPalette(colorPalette.secondary) : null;

  return (
    <div
      tw="flex flex-col px-12 py-16 h-full w-full"
      style={{ backgroundColor: secondary?.["100"] || lead["100"], color: lead["900"] }}
    >
      <div tw="flex items-center">
        <img src={getAbsoluteUrl(revolution.logoUrl)} width={80} height={80} alt="" />
        {grant.imageUrl && (
          <>
            <div tw="mx-8 flex justify-center items-center">+</div>
            <div tw="flex rounded-xl">
              <img width="80" height="80" src={grant.imageUrl} alt=" " tw="rounded-xl" />
            </div>
          </>
        )}
      </div>
      <p tw="mt-8 mb-8">
        {grant.title} is part of the {revolution.name} Grants - an unique, community-driven program
        designed to support builders, creators, professionals, artists and more.
      </p>
      <div tw="flex items-start">
        <div tw="flex flex-col pr-24">
          <h3 tw="text-3xl mb-2">{pluralize("Builder", profiles.length)}</h3>
          {profiles.map(p => (
            <div tw="flex items-center mt-4 text-3xl" key={p.address}>
              <div tw="flex rounded-full w-12 h-12 mr-2.5" style={{ backgroundColor: lead[600] }}>
                {p.profilePicture && (
                  <img src={p.profilePicture} width={48} height={48} alt="" tw="rounded-full" />
                )}
              </div>
              {p.displayUsername}
            </div>
          ))}
        </div>
        <div tw="flex flex-col pr-24">
          <h3 tw="text-3xl mb-2">Votes</h3>
          <span>TBD</span>
        </div>
        <div tw="flex flex-col">
          <h3 tw="text-3xl mb-2">Funding</h3>
          <span>TBD</span>
        </div>
      </div>
    </div>
  );
}
