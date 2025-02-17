/* eslint-disable @next/next/no-img-element */
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { IRevolutionConfig } from "@cobuild/libs/revolution/interfaces";
import { getAbsoluteUrl } from "@cobuild/libs/utils/url";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { revolutionId: string };
}

export default async function og(props: Props) {
  const { revolutionId } = props.params;

  const config = getRevolutionConfig(revolutionId);

  try {
    return new ImageResponse(generateRevolutionSeoImage(config));
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}

export function generateRevolutionSeoImage(config: IRevolutionConfig) {
  const {
    name,
    faviconUrl,
    logoUrl,
    landingPage: { backdropImage },
  } = config;

  const image = faviconUrl || logoUrl;

  return (
    <div tw="w-full h-full flex flex-col justify-end bg-black relative px-12 py-16">
      {backdropImage && (
        <div tw="flex absolute bg-black opacity-40 inset-0">
          <img
            width="1200"
            height="630"
            src={getAbsoluteUrl(backdropImage)}
            style={{ objectFit: "cover" }}
            alt=" "
          />
        </div>
      )}
      <div tw="flex flex-col">
        {image && (
          <div tw="flex">
            <img width="128" height="128" src={getAbsoluteUrl(image)} alt=" " />
          </div>
        )}
        <h2 tw="mt-4 mb-0 text-[92px] font-bold text-white leading-none tracking-tighter">
          {name}
        </h2>
      </div>
    </div>
  );
}
