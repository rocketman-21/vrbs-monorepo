import { Post, Scope, ScopeType } from "prisma-database";
import { cache } from "react";
import { database } from "../..";
import { IPost } from "./IPost";
import { transformPost } from "./Post";

export function Posts() {
  return {
    findById,
    add,
    toggleVote,
    getForScope,
    isValidScopeType,
  };
}

const findById = cache(async (postId: string) => {
  const post = await database.post.findFirst({ where: { postId }, include: { profile: true } });
  return post ? transformPost(post) : null;
});

const getForScope = cache(async (scopeId: Scope["id"]): Promise<IPost[]> => {
  const posts = await database.post.findMany({
    where: {
      scope: { is: { id: scopeId } },
      OR: [
        { parentPostId: { equals: database.post.fields.rootPostId } },
        { parentPostId: { isSet: false } },
      ],
    },
    include: {
      profile: true,
      children: { include: { profile: true, children: { include: { profile: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const transformed = posts.map(transformChildren);

  return transformed.filter((post): post is IPost => post !== null);
});

const transformChildren = (post: Post & { children?: Post[] }) => {
  const transformedPost = transformPost(post);
  if (!transformedPost) return null;

  const children = post?.children;
  if (children) {
    let transformedChildren = children.map(transformChildren);

    transformedPost.children = transformedChildren.filter(
      (child): child is IPost => child !== null,
    );
  }
  return transformedPost;
};

const add = async (
  data: Pick<Post, "markdown" | "parentPostId" | "rootPostId" | "scope" | "address">,
  notificationScope: Scope,
) => {
  const post = transformPost(await database.post.create({ data, include: { profile: true } }));

  if (post?.parentPostId) {
    await database.post.update({
      where: { postId: post.parentPostId },
      data: { childrenCount: { increment: 1 } },
    });
  }

  await updatePostsCount(post.scope);

  return post;
};

const toggleVote = async (postId: string, address: `0x${string}`, revolutionId: string) => {
  const [post, liker] = await Promise.all([
    Posts().findById(postId),
    database.profile.findFirst({
      where: { address },
    }),
  ]);

  if (!post) return;

  const action = post.upvotes.includes(address) ? "downvote" : "upvote";

  const updatedPost = await database.post.update({
    where: { postId },
    data:
      action === "upvote"
        ? {
            upvoteCount: { increment: 1 },
            upvotes: { push: address },
          }
        : {
            upvoteCount: { decrement: 1 },
            upvotes: { set: post.upvotes.filter(u => u !== address) },
          },
    select: { upvotes: true },
  });

  return updatedPost;
};

function isValidScopeType(type: string): type is ScopeType {
  return Object.keys(ScopeType).includes(type as ScopeType);
}

async function updatePostsCount(scope: Scope) {
  switch (scope.type) {
    case "idea":
      await database.idea.update({
        where: { ideaId: scope.id },
        data: { commentsCount: { increment: 1 } },
      });
    default:
      return;
  }
}
