import { AuctionView } from "../components/AuctionView";

interface Props {
  params: { revolutionId: string; tokenId: string };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

const AuctionPage = async (props: Props) => {
  const { revolutionId, tokenId } = props.params;

  return <AuctionView tokenId={tokenId} revolutionId={revolutionId} />;
};

export default AuctionPage;
