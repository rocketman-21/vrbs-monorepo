/* eslint-disable @next/next/no-img-element */
import { Pools } from "@cobuild/database/models/revolution/pools/Pools";
import { IPool } from "@cobuild/database/types";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { alloPoolId: string; revolutionId: string; chainId: string };
}

export default async function og(props: Props) {
  const { alloPoolId, chainId } = props.params;

  try {
    const grant = await Pools().getById(alloPoolId, parseInt(chainId));
    if (!grant) throw new Error("Grant not found");

    return new ImageResponse(generateSeoImage(grant));
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}

function generateSeoImage(grant: IPool) {
  const { title, imageUrl } = grant;

  return (
    <div tw="w-full h-full flex flex-col justify-end bg-black relative px-12 py-16">
      {imageUrl && (
        <div tw="flex absolute bg-black opacity-25 inset-0">
          <img
            width="1200"
            height="630"
            src={imageUrl}
            style={{
              objectFit: "cover",
              filter: "blur(20px)",
            }}
            alt=" "
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
        <h2 tw="mt-4 mb-0 text-[80px] font-bold text-white leading-none tracking-tighter">
          {title}
        </h2>
      </div>
    </div>
  );
}
