import "server-only";

import { Ideas } from "@cobuild/database/models/social/Ideas";
import { getUser } from "@cobuild/libs/user/server";
import { EmptyState } from "@cobuild/ui/atoms/EmptyState/EmptyState";
import { Scrollable } from "@cobuild/ui/atoms/Scrollable";
import { ReactNode } from "react";
import { IdeaItem } from "../components/ideas/IdeaItem";

export const maxDuration = 300;

interface Props {
  params: { revolutionId: string };
  children: ReactNode;
}

const IdeasLayoutPage = async (props: Props) => {
  const { revolutionId } = props.params;

  const ideas = await Ideas().getForRevolution({ revolutionId });
  const user = await getUser(revolutionId);

  if (ideas.length === 0) {
    return (
      <div className="col-span-2 flex h-full items-center justify-center">
        <EmptyState text="There are not any published ideas yet. Imagine if..." />
      </div>
    );
  }

  return (
    <>
      <div className="lg:h-body flex flex-col max-lg:px-2 lg:col-span-2 lg:pt-8">
        <Scrollable vertical className="mb-2.5 space-y-2.5">
          {ideas.map(idea => (
            <IdeaItem idea={idea} key={idea.ideaId} user={user} revolutionId={revolutionId} />
          ))}
        </Scrollable>
      </div>
      <div className="lg:h-body flex flex-col max-lg:px-2 lg:pt-2">
        <Scrollable vertical>{props.children}</Scrollable>
      </div>
    </>
  );
};

export default IdeasLayoutPage;
