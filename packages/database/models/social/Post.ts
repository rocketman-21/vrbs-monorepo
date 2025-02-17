import { Post, Profile } from "prisma-database";
import { IPost } from "./IPost";

interface ProfilePopulated extends Post {
  profile?: Profile | null;
}

export function transformPost(post: ProfilePopulated): IPost {
  return Object.assign(post, {
    profile: post.profile ?? undefined,
    url: (revolutionId: string) => getPostUrl(post, revolutionId),
  });
}

function getPostUrl(post: Post, revolutionId: string | null) {
  const { type, id } = post.scope;

  const urlPrefix = `/${revolutionId}`;
  const daoPrefix = `/dao`;

  switch (type) {
    case "submission":
      return `${urlPrefix}/creations/${id}`;
    case "draft":
      return `${urlPrefix}${daoPrefix}/drafts/${id}`;
    case "idea":
      return `${urlPrefix}${daoPrefix}/ideas/${id}`;
    case "proposal":
      return `${urlPrefix}${daoPrefix}/proposals/${id.split("-").pop()}`;
    case "story":
      return `${urlPrefix}/stories/${id}`;
    case "grant":
      return `${urlPrefix}/grants/${id}`;
    case "community":
    case "project":
    case "revolution":
    case "vote":
      return null;
  }

  return null;
}
