import "server-only";

import { MediaType, Submission } from "prisma-database";
import { IProfile } from "../../social/IProfile";

export interface ISubmission extends Submission {
  videoUrl: string | null;
  streamUrl: string | null;
  sponsorAddress: `0x${string}`;
  contractAddress: `0x${string}`;
  width: number;
  height: number;
  layout: {
    isVertical: boolean;
    isHorizontal: boolean;
    isSquare: boolean;
  };
  mediaType: MediaType;
  votes: () => Promise<Array<{ weight: number; voter: `0x${string}` }>>;
  creatorProfiles: () => Promise<IProfile[]>;
}
