/* eslint-disable @next/next/no-img-element */
import { Submissions } from "@cobuild/database/models/revolution/submissions/Submissions";
import { ImageResponse } from "next/og";

export const contentType = "image/png";

interface Props {
  params: { revolutionId: string; slug: string };
}

export default async function og(props: Props) {
  const { slug } = props.params;

  try {
    const submission = await Submissions().findBySlug(slug);

    if (!submission) throw new Error("Submission not found");
    if (!submission.thumbnailUrl) return null;

    const width = submission.mediaMetadata?.width || 1024;
    const height = submission.mediaMetadata?.height || 1024;

    return new ImageResponse(generateSeoImage(submission.thumbnailUrl, width, height), {
      height,
      width,
    });
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}

function generateSeoImage(imageUrl: string, width: number, height: number) {
  return (
    <div tw="w-full h-full flex flex-col items-center justify-center relative">
      <div
        tw="flex absolute opacity-75"
        style={{
          left: "-1024px",
          right: "-1024px",
          top: "-1024px",
          bottom: "-1024px",
          filter: "blur(64px)",
        }}
      >
        <img width={width} height={height} src={imageUrl} alt=" " tw="w-full h-full" />
      </div>
      <img
        width={width - 156}
        height={height - 156}
        src={imageUrl}
        alt=" "
        tw="relative rounded-xl"
      />
    </div>
  );
}
