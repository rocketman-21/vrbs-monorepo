"use client";

import { useKeyPress } from "@cobuild/libs/hooks/useKeyPress";
import { useRouter } from "next/navigation";

interface Props {
  previousTokenUrl: string | null;
  nextTokenUrl: string | null;
}

export const DropNavigationKeyboard = (props: Props) => {
  const { previousTokenUrl, nextTokenUrl } = props;

  const router = useRouter();

  useKeyPress(() => {
    if (!previousTokenUrl) return;
    router.push(previousTokenUrl);
  }, ["ArrowLeft"]);

  useKeyPress(() => {
    if (!nextTokenUrl) return;
    router.push(nextTokenUrl);
  }, ["ArrowRight"]);

  return <></>;
};
