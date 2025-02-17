import { Proposals } from "@cobuild/database/models/governance/Proposals";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: { revolutionId: string };
}

export default async function GovernancePage(props: Props) {
  const revolution = await Revolutions().getById(props.params.revolutionId);

  if (!revolution) {
    return notFound();
  }

  const propsCount = await Proposals().countForEntityId(revolution.governanceEntityId);
  if (propsCount === 0) {
    return redirect(`/${props.params.revolutionId}/dao/drafts`);
  }

  return redirect(`/${props.params.revolutionId}/dao/proposals`);
}
