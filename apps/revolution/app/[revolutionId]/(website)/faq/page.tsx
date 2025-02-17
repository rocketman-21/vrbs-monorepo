import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { serializeSync } from "@cobuild/database/utils";
import { Faq } from "app/components/faq/Faq";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";

interface Props {
  params: { revolutionId: string };
}

export const dynamic = "force-dynamic";

export default async function FaqPage(props: Props) {
  const { revolutionId } = props.params;
  const revolution = await Revolutions().getById(revolutionId);

  if (!revolution || !revolution.addresses) notFound();

  return (
    <main className="relative mt-16 lg:mt-20">
      <Faq revolutionId={revolutionId} revolution={serializeSync(revolution)} />
    </main>
  );
}
