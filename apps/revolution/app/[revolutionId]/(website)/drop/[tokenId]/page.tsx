import { DropView } from "../components/DropView";

interface Props {
  params: { revolutionId: string; tokenId: string };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

const AuctionPage = async (props: Props) => {
  const { revolutionId, tokenId } = props.params;

  return <DropView tokenId={tokenId} revolutionId={revolutionId} />;
};

export default AuctionPage;
