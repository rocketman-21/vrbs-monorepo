import "server-only";

import { IGrant } from "@cobuild/database/types";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { Suspense } from "react";
import { truncateString } from "@cobuild/libs/utils/text";

interface Props {
  grant: IGrant;
}

export const GrantBreadcrumbs = async (props: Props) => {
  const { grant } = props;
  const { revolutionId } = grant;

  const { name } = getRevolutionConfig(revolutionId);

  const parent = grant.parent();

  return (
    <nav className="text-sm font-medium text-zinc-500">
      <ol className="list-reset flex">
        <li>
          <a href={`/${revolutionId}/grants`} className="text-lead-600 hover:underline whitespace-nowrap">
            {name} Grants
          </a>
        </li>

        {!grant.isTopLevel && (
          <li className="truncate">
            <span className="mx-2">/</span>
            <Suspense>
              <a
                href={`/${revolutionId}/grants/${(await parent)?.chainId}/${(await parent)?.alloProfileId}`}
                className="text-lead-600 hover:underline"
              >
                {truncateString((await parent)?.title || "", 30)}
              </a>
            </Suspense>
          </li>
        )}

        <li className="truncate">
          <span className="mx-2">/</span>
          {truncateString(grant.title, 30)}
        </li>
      </ol>
    </nav>
  );
};
