import { database } from "@cobuild/database";
import { getAbsoluteUrl } from "@cobuild/libs/utils/url";
import { Button, createFrames } from "frames.js/next";
import { getAboutFrame } from "./AboutFrame";
import { generateGrantSeoImage } from "./GrantImage";

const frames = createFrames();

const handleRequest = frames(async ctx => {
  const pathname = ctx.url.pathname;
  const [, revolutionId, , chainId, alloProfileId] = pathname.split("/");

  const grant = await database.alloProfile.findUnique({
    where: { chainId_alloProfileId: { alloProfileId, chainId: Number(chainId) } },
  });

  if (!grant) throw new Error("Grant not found");

  const VoteButton = (
    <Button action="link" target={`/${revolutionId}/grants/?vote`}>
      Vote
    </Button>
  );

  const frame = ctx.searchParams.frame;

  switch (frame) {
    case "about":
      return {
        image: await getAboutFrame(grant),
        buttons: [
          <Button action="post" target={{ pathname }} key="back">
            Go back
          </Button>,
          <Button
            key="visit"
            action="link"
            target={getAbsoluteUrl(`/${grant.revolutionId}/grants/${chainId}/${alloProfileId}`)}
          >
            Visit
          </Button>,
          VoteButton,
        ],
      };
    default:
      return {
        image: generateGrantSeoImage(grant),
        buttons: [
          <Button action="post" target={{ pathname, query: { frame: "about" } }} key="learn">
            Learn more
          </Button>,
          VoteButton,
        ],
      };
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
