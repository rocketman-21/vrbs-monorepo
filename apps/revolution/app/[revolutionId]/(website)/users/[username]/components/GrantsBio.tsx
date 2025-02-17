import "server-only";

import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import Link from "next/link";
import pluralize from "pluralize";

interface Props {
  revolutionId: string;
  user: `0x${string}`;
}

export const GrantsBio = async (props: Props) => {
  const { revolutionId, user } = props;

  const grants = (await Grants().getForUser(revolutionId, user)).filter(g => g.isApproved);

  if (grants.length === 0) return null;

  return (
    <div className="mt-6">
      Recipient of{" "}
      {grants.map((g, index) => (
        <>
          <Link
            href={g.url}
            key={g.alloProfileId}
            className="hover:text-lead-500 decoration-lead-400 underline underline-offset-4 duration-100 ease-out"
          >
            {g.title}
          </Link>
          {index < grants.length - 1 ? ", " : " "}
        </>
      ))}
      {pluralize("grant", grants.length)}.
    </div>
  );
};
