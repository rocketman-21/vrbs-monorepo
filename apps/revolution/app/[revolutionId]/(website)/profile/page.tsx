import { Profiles } from "@cobuild/database/models/social/Profiles";
import { getUser } from "@cobuild/libs/user/server";

import { redirect } from "next/navigation";

interface Props {
  params: {
    revolutionId: string;
  };
}

export default async function UserPage(props: Props) {
  const { params } = props;
  const { revolutionId } = params;

  const user = await getUser(revolutionId);

  if (!user) {
    redirect(`/${revolutionId}`);
  }

  const profile = await Profiles().get(user);

  return redirect(`/${props.params.revolutionId}/users/${profile.username}`);
}
