import { IStory } from "@cobuild/database/types";
import { serializeSync } from "@cobuild/database/utils";
import { getUser } from "@cobuild/libs/user/server";
import { getInitiativesOptions } from "../../grants/components/getInitiativesOptions";
import { EditStoryButton } from "./EditStoryButton";

interface Props {
  story: IStory;
}

export const StoryAction = async (props: Props) => {
  const { story } = props;

  const user = await getUser(story.revolutionId);
  const canEdit = !!user && story.canBeEditedBy(user);

  if (!canEdit) return null;

  const initiatives = await getInitiativesOptions(story.revolutionId);

  return <EditStoryButton story={serializeSync(story)} size="md" initiatives={initiatives} />;
};
