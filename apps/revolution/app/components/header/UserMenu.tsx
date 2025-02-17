import "server-only";

import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getUser } from "@cobuild/libs/user/server";
import { getNftForOwner } from "@cobuild/libs/web3/alchemy/getNftForOwner";
import { getUserPower } from "app/libs/vote-power";
import { Suspense } from "react";
import { AvatarMenu } from "./AvatarMenu/AvatarMenu";
import { BuilderMenu } from "./BuilderMenu/BuilderMenu";
import { CreateDrop } from "./CreateDrop";
import { GuestMenu } from "./GuestMenu";

export interface Props {
  revolutionId: string;
}

export default async function UserMenu(props: Props) {
  const { revolutionId } = props;

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) return null;

  const [user, { votingPower }] = await Promise.all([
    getUser(revolutionId),
    getUserPower(revolutionId),
  ]);

  const { chainId, addresses, token } = revolution;
  const contractAddress = addresses?.token;

  const nftsPromise =
    user && BigInt(votingPower) > 0n && contractAddress
      ? getNftForOwner({ contractAddress, owner: user, chainId })
      : Promise.resolve([]);

  const [nfts, userGrants] = await Promise.all([
    nftsPromise,
    Grants().getForUser(revolutionId, user),
  ]);

  return (
    <div className="flex items-center space-x-2.5 md:space-x-4">
      {revolution.hasGrants && user && <BuilderMenu user={user} grants={userGrants} />}
      {revolution.hasDrops && user && (
        <Suspense>
          <CreateDrop revolution={revolution} />
        </Suspense>
      )}

      {!user && <GuestMenu />}

      {user && (
        <AvatarMenu
          user={user}
          nfts={nfts.map(nft => ({
            name: nft.name || token?.name || "NFT",
            imageUrl: nft.image.thumbnailUrl || "",
            tokenId: nft.tokenId,
          }))}
        />
      )}
    </div>
  );
}
