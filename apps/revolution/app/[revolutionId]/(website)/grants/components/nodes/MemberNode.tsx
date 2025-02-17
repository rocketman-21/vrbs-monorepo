"use client";

import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { UserProfileClient } from "app/components/user-profile/UserProfileClient";
import { UserProfilePopover } from "app/components/user-profile/UserProfilePopover";
import { useRevolution } from "app/libs/useRevolution";
import Link from "next/link";
import { memo } from "react";

export type IMemberNode = Node<{ address: `0x${string}` }, "member">;

function MemberNode(props: NodeProps<IMemberNode>) {
  const { address } = props.data;
  const { revolutionId } = useRevolution();

  return (
    <UserProfileClient address={address}>
      {profile => (
        <UserProfilePopover profile={profile} revolutionId={revolutionId}>
          <Link
            href={`/${revolutionId}/users/${profile.username}`}
            className="pointer-events-auto flex cursor-auto items-center"
          >
            <Avatar
              id={profile.address}
              imageUrl={profile.profilePicture}
              size={32}
              className="size-8"
            />
            <h3 className="ml-1.5 text-sm">{profile.displayUsername}</h3>
            <Handle
              type="target"
              position={Position.Left}
              isConnectable={false}
              style={{ background: "var(--color-lead-500)" }}
            />
          </Link>
        </UserProfilePopover>
      )}
    </UserProfileClient>
  );
}

export default memo(MemberNode);
