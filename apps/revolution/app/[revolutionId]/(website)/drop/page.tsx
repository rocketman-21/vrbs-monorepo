import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { getDropCurrentTokenId } from "@cobuild/libs/web3/zora-drop/current-token-id";
import { notFound } from "next/navigation";
import { DropView } from "./components/DropView";

interface Props {
  params: { revolutionId: string };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(props: Props) {
  return getRevolutionConfig(props.params.revolutionId).defaultSeo;
}

const DropHomepage = async (props: Props) => {
  const { revolutionId } = props.params;
  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution || !revolution.addresses?.drop) notFound();

  const currentTokenId = await getDropCurrentTokenId(revolution.addresses.drop, revolution.chainId);
  if (!currentTokenId) notFound();

  return <DropView revolutionId={revolutionId} tokenId={currentTokenId} />;
};

export default DropHomepage;
