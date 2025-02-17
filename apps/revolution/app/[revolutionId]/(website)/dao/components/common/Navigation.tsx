"use client";

import { HorizontalMenu, HorizontalMenuItem } from "@cobuild/ui/atoms/HorizontalMenu";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";

interface Props {
  revolutionId?: string;
  urlPrefix: string;
}

export const Navigation = (props: Props) => {
  const { revolutionId } = props;
  const { type } = useNavigation(revolutionId);
  const router = useRouter();

  return (
    <HorizontalMenu>
      <HorizontalMenuItem
        isActive={type === "proposals"}
        onClick={() => router.push(`${props.urlPrefix}/proposals`)}
      >
        Proposals
      </HorizontalMenuItem>
      {revolutionId && (
        <HorizontalMenuItem
          isActive={type === "drafts"}
          onClick={() => router.push(`${props.urlPrefix}/drafts`)}
        >
          Drafts
        </HorizontalMenuItem>
      )}
      {revolutionId && (
        <HorizontalMenuItem
          isActive={type === "ideas"}
          onClick={() => router.push(`${props.urlPrefix}/ideas`)}
        >
          Ideas
        </HorizontalMenuItem>
      )}
    </HorizontalMenu>
  );
};

export function useNavigation(revolutionId?: string) {
  const segments = useSelectedLayoutSegments();

  // Different URL structure on houses vs revolutions
  const type = revolutionId ? segments[0] || "proposals" : "proposals";
  const currentId = revolutionId ? segments[1] : segments[0];

  return { type, currentId };
}
