"use client";

import { IStory, Serialized } from "@cobuild/database/types";
import { Button } from "@cobuild/ui/atoms/Button";
import { IOption } from "@cobuild/ui/atoms/Select";
import { ComponentProps, useState } from "react";
import { EditStoryModal } from "./EditStoryModal";

type ButtonProps = ComponentProps<typeof Button>;

interface Props {
  size?: ButtonProps["size"];
  initiatives: IOption[];
  story: Serialized<IStory>;
}

export const EditStoryButton = (props: Props) => {
  const { size, initiatives, story } = props;

  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <EditStoryModal
        story={story}
        initiatives={initiatives}
        isOpen={isEditing}
        closeModal={() => setIsEditing(false)}
      />
      <Button size={size} color="outline" onClick={() => setIsEditing(true)}>
        Edit information
      </Button>
    </>
  );
};
