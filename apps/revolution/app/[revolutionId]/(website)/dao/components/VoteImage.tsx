import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { shortenIfEthAddress } from "@cobuild/libs/utils/account";
import { getAbsoluteUrl } from "@cobuild/libs/utils/url";
import pluralize from "pluralize";

/* eslint-disable @next/next/no-img-element */

interface Props {
  username: string;
  reason?: string | null;
  profilePicture?: string | null;
  name: string;
  numVotes: string;
  proposalId: string;
  proposalTitle?: string;
  revolutionId: string;
}

const IMAGE_WIDTH = 780;
const LINE_HEIGHT = 1.3;

export function generateVoteImage(props: Props) {
  const {
    profilePicture,
    username,
    reason = "",
    name,
    numVotes,
    proposalId,
    proposalTitle,
    revolutionId,
  } = props;

  const { logoUrl, landingPage, name: revolutionName } = getRevolutionConfig(revolutionId);

  const fontSize = calculateFontSize(reason);
  const reasonHeight = calculateReasonHeight(reason, fontSize);
  const height = reasonHeight + 420;

  const voteLabelClass =
    name.toLowerCase() === "for"
      ? "bg-green-500"
      : name.toLocaleLowerCase() === "against"
        ? "bg-red-500"
        : "bg-zinc-500";

  const image = (
    <div tw="w-full h-full flex flex-col bg-white relative p-8">
      {landingPage.backdropImage && (
        <div tw="flex absolute bg-white opacity-5 inset-0">
          <img
            width={IMAGE_WIDTH}
            height={height}
            src={getAbsoluteUrl(landingPage.backdropImage)}
            style={{ objectFit: "cover" }}
            alt=" "
          />
        </div>
      )}

      <div tw="flex justify-center">
        <img width="64" height="64" src={getAbsoluteUrl(logoUrl)} alt=" " tw="rounded-xl" />
      </div>

      <div tw="flex flex-col items-center mt-4">
        <h3 tw="text-black text-2xl font-bold leading-none m-0">{proposalTitle}</h3>
        <h5 tw="text-zinc-800 text-lg font-medium leading-none m-0 mt-1">
          {revolutionName} Proposal {proposalId ? `#${proposalId}` : ""}
        </h5>
      </div>

      <div tw="flex mt-8 mb-4 py-4 border-t border-b border-zinc-300 justify-between items-center">
        <div tw="flex items-center">
          <div tw="flex rounded-2xl overflow-hidden">
            {profilePicture && (
              <img width="32" height="32" src={profilePicture} alt=" " tw="rounded-full mr-1.5" />
            )}
          </div>
          <span tw="text-lg">{shortenIfEthAddress(username)}</span>
        </div>
        <div tw="flex items-center">
          <span tw={`text-white ${voteLabelClass} rounded-xl leading-none px-2.5 uppercase py-1`}>
            {name}
          </span>
          <span tw="ml-2 bg-zinc-200 rounded-xl px-2.5 uppercase py-1">
            {numVotes} {pluralize("vote", Number(numVotes))}
          </span>
        </div>
      </div>

      {reason && (
        <div tw="flex flex-col grow justify-around">
          {reason.split("\n").map((item, key) => (
            <div tw="flex" key={key} style={{ fontSize, lineHeight: LINE_HEIGHT }}>
              {item}
              <br />
              <div tw="mt-6" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return { image, height, width: IMAGE_WIDTH };
}

export function getVoteImageUrl(props: Props): string {
  const {
    profilePicture = "",
    username,
    reason,
    name,
    numVotes,
    proposalId,
    proposalTitle,
    revolutionId,
  } = props;

  const url = new URL(getAbsoluteUrl(`/${revolutionId}/voteImage`));
  url.searchParams.append("reason", reason || "");
  url.searchParams.append("username", username);
  url.searchParams.append(
    "profilePicture",
    profilePicture?.startsWith("http") ? profilePicture : "",
  );
  url.searchParams.append("name", name);
  url.searchParams.append("numVotes", numVotes || "0");
  url.searchParams.append("proposalId", proposalId || "");
  url.searchParams.append("proposalTitle", proposalTitle || "");

  return url.href;
}

function calculateFontSize(reason: string | null) {
  const length = reason?.length || 0;

  if (length <= 50) return 34;
  if (length <= 400) return 30;
  if (length <= 600) return 28;
  if (length <= 750) return 26;
  if (length <= 1000) return 24;
  if (length <= 1250) return 22;
  return 20;
}

function calculateReasonHeight(reason: string | null, fontSize: number) {
  if (!reason || reason.length === 0) return 0;

  const numLines = reason
    .split("\n")
    .map(item => getNumLines(item, fontSize, IMAGE_WIDTH))
    .reduce((a, b) => a + b, 0);

  return fontSize * numLines * LINE_HEIGHT;
}

function getNumLines(text: string, fontSize: number, width: number) {
  const numCharactersPerLine = Math.floor(width / (fontSize * 0.6));
  const pixelsPerLine = fontSize * 0.6 * numCharactersPerLine;

  const words = text.split(" ");
  let numLines = 0;
  let currentLine = "";

  for (const word of words) {
    const wordLengthPixels = word.length * fontSize * 0.47;
    const currentLineLengthPixels = currentLine.length * fontSize * 0.47;

    // check if adding the current word to the current line would make the line too long
    if (currentLineLengthPixels + wordLengthPixels > pixelsPerLine) {
      // if the line would be too long, increment the line count and start a new line
      numLines += 1;
      currentLine = "";
    }
    // add the current word to the current line
    currentLine += word + " ";
  }

  // add the last line
  if (currentLine.length > 0) {
    numLines += 1;
  }

  return numLines;
}
