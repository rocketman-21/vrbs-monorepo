"use client";

import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { PostCreationModal } from "app/components/creations/PostCreationModal/PostCreationModal";
import { PostCreationProvider } from "app/components/creations/PostCreationModal/PostCreationProvider";
import { useRevolution } from "app/libs/useRevolution";

export const CreatePostModal = () => {
  const [showModal, setShowModal] = useUrlState("create");
  const { cultureIndex } = useRevolution();

  if (!cultureIndex || !cultureIndex.chainId || !cultureIndex.address) return null;

  return (
    <PostCreationProvider
      cultureIndex={cultureIndex}
      isOpen={showModal !== null}
      closeModal={() => setShowModal("")}
    >
      <PostCreationModal />
    </PostCreationProvider>
  );
};
