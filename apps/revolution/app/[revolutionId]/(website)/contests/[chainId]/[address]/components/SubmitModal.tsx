"use client";

import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { CultureIndexData } from "@cobuild/libs/revolution/cultureIndex";
import { PostCreationModal } from "app/components/creations/PostCreationModal/PostCreationModal";
import { PostCreationProvider } from "app/components/creations/PostCreationModal/PostCreationProvider";

interface Props {
  cultureIndex: CultureIndexData;
}

export const SubmitModal = (props: Props) => {
  const { cultureIndex } = props;
  const [showModal, setShowModal] = useUrlState("submit");

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
