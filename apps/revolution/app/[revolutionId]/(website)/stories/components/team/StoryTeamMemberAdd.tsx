"use client";

import { getErrorMessage } from "@cobuild/libs/utils/error";
import { normalizeEthAddressOrEnsName } from "@cobuild/libs/web3/ens";
import { toast } from "@cobuild/ui/organisms/Notifications";
import { useRevolution } from "app/libs/useRevolution";
import { useRouter } from "next/navigation";
import { addTeamMember } from "./addTeamMember";

interface Props {
  slug: string;
  isContributor?: boolean;
}

export const StoryTeamMemberAdd = (props: Props) => {
  const { slug, isContributor = false } = props;

  const { revolutionId } = useRevolution();
  const router = useRouter();

  return (
    <button
      type="button"
      className="hover:text-lead-500 text-lead-600 dark:text-lead-300 hover:dark:text-lead-200 flex items-center text-[13px] duration-100"
      onClick={async () => {
        const input = prompt("Enter ETH Address or ENS name") || "";
        if (!input) return;

        const comment = isContributor
          ? prompt("Write a short (max 80 chars) kudos to the user") || ""
          : undefined;

        try {
          const address = await normalizeEthAddressOrEnsName(input);
          const result = await addTeamMember(slug, revolutionId, isContributor, {
            address,
            comment,
          });

          if (result.story) {
            toast.success("User added!");
            router.refresh();
          }

          if (result.error) {
            throw new Error(result.error);
          }
        } catch (error) {
          toast.error(getErrorMessage(error));
        }
      }}
    >
      + Add {isContributor ? "contributor" : "member"}
    </button>
  );
};
