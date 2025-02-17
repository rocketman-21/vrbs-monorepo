/* eslint-disable @next/next/no-img-element */
import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { getPalette } from "@cobuild/libs/revolution/palette";
import { getAbsoluteUrl } from "@cobuild/libs/utils/url";
// import { ImageResponse } from "next/og";
import { AlloProfile as Grant } from "prisma-database";

// export const size = { width: 1200, height: 630 };
// export const contentType = "image/png";

// interface Props {
//   params: { alloProfileId: string; revolutionId: string; chainId: string };
// }

// export default async function og(props: Props) {
//   const { alloProfileId, chainId } = props.params;

//   try {
//     const grant = await Grants().getById(alloProfileId, parseInt(chainId));
//     if (!grant) throw new Error("Grant not found");

//     return new ImageResponse(generateGrantSeoImage(grant));
//   } catch (e: any) {
//     return new Response(e.message, { status: 500 });
//   }
// }

export function generateGrantSeoImage(grant: Grant) {
  const { title, tagline, imageUrl, revolutionId } = grant;

  const { colorPalette, aboutBackgroundPattern } = getRevolutionConfig(revolutionId);

  const lead = getPalette(colorPalette.lead);
  const secondary = colorPalette.secondary ? getPalette(colorPalette.secondary) : null;

  return (
    <div
      tw="w-full h-full flex flex-col justify-end relative px-12 py-16"
      style={{ backgroundColor: secondary?.["100"] || lead["100"], color: lead["900"] }}
    >
      {aboutBackgroundPattern && (
        <div tw="flex absolute opacity-15 inset-0">
          <img
            width="1200"
            height="630"
            src={getAbsoluteUrl(aboutBackgroundPattern)}
            tw="h-full w-full"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <div tw="flex flex-col">
        {imageUrl && (
          <div tw="flex">
            <div tw="flex bg-black rounded-xl">
              <img width="128" height="128" src={imageUrl} alt=" " tw="rounded-xl" />
            </div>
          </div>
        )}
        <h2 tw="mt-4 mb-0 text-[80px] font-bold  leading-none tracking-tighter">{title}</h2>
        <h5 tw="mt-2.5 mb-0 text-[32px] leading-none tracking-tight">{tagline}</h5>
      </div>
    </div>
  );
}
