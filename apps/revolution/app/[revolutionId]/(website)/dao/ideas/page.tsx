import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import "server-only";

export const revalidate = 120;

export const maxDuration = 300;

interface Props {
  params: { revolutionId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const revolution = await Revolutions().getById(params.revolutionId);
  if (!revolution) notFound();
  return { title: `${revolution.name} Ideas` };
}

const IdeasPage = async (props: Props) => {
  return null;
};

export default IdeasPage;
