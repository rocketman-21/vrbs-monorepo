import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getCurrentAuction } from "@cobuild/libs/web3/auction/current-auction";
import { notFound } from "next/navigation";
import { AuctionView } from "./components/AuctionView";
// import { fetchMetadata } from "frames.js/next";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";

interface Props {
  params: { revolutionId: string };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(props: Props) {
  const seo = getRevolutionConfig(props.params.revolutionId).defaultSeo;

  // const frameMetadata = await fetchMetadata(`https://frames.paperclip.xyz/nounish-auction/v2/vrbs`);

  // console.log({ frameMetadata });

  return {
    ...seo,
    // other: frameMetadata,
  };
}

const AuctionHomepage = async (props: Props) => {
  const { revolutionId } = props.params;
  const { addresses, chainId } = (await Revolutions().getById(revolutionId)) || {};

  if (!addresses || !chainId || !addresses.auction) notFound();

  const currentAuction = await getCurrentAuction(addresses.auction, chainId);
  if (!currentAuction) notFound();

  return <AuctionView revolutionId={revolutionId} tokenId={currentAuction.tokenId} />;
};

export default AuctionHomepage;
