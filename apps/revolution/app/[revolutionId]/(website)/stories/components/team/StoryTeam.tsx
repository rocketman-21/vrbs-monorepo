import { StoryTeamMember } from "./StoryTeamMember";
import { StoryTeamMemberAdd } from "./StoryTeamMemberAdd";

type Props = {
  slug: string;
  team: { address: `0x${string}`; comment?: string }[];
  revolutionId: string;
  canEdit: boolean;
  isContributor?: boolean;
};

export const StoryTeam = (props: Props) => {
  const { team, revolutionId, canEdit, slug, isContributor = false } = props;

  return (
    <div className="space-y-2.5">
      {team.map(member => (
        <StoryTeamMember
          key={member.address}
          address={member.address}
          revolutionId={revolutionId}
          removeable={canEdit}
          comment={member.comment}
          isContributor={isContributor}
          slug={slug}
        />
      ))}

      {canEdit && <StoryTeamMemberAdd isContributor={isContributor} slug={slug} />}
    </div>
  );
};
