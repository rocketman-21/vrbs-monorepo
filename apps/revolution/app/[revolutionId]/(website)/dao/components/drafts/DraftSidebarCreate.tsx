import { useRouter } from "next/navigation";
import { CreateDraftButton } from "./useCreateDraft";
import { useDrafts } from "./useDrafts";

interface Props {
  revolutionId: string;
}

export const DraftSidebarCreate = (props: Props) => {
  const { revolutionId } = props;

  const { mutate: refreshDraftsList } = useDrafts({ revolutionId });
  const router = useRouter();

  return (
    <CreateDraftButton
      color="outline"
      size="sm"
      revolutionId={revolutionId}
      onSuccess={draftId => {
        if (revolutionId) {
          router.push(`/${revolutionId}/dao/drafts/${draftId}`);
        }
        refreshDraftsList();
      }}
    >
      + New Draft
    </CreateDraftButton>
  );
};
