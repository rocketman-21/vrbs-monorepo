"use client";

import { IProfile } from "@cobuild/database/types";
import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { UserProfilePopover } from "app/components/user-profile/UserProfilePopover";
import Link from "next/link";
import { memo } from "react";

export type IMembersNode = Node<{ profiles: IProfile[]; revolutionId: string }, "members">;

function MembersNode(props: NodeProps<IMembersNode>) {
  const { width } = props;
  const { profiles, revolutionId } = props.data;

  return (
    <div className="pointer-events-auto cursor-auto" style={{ width }}>
      <div className="flex flex-wrap justify-center">
        {profiles.map(profile => (
          <UserProfilePopover revolutionId={revolutionId} profile={profile} key={profile.address}>
            <Link href={`/${revolutionId}/users/${profile.username}`}>
              <Avatar id={profile.address} imageUrl={profile.profilePicture} className="m-0.5" />
            </Link>
          </UserProfilePopover>
        ))}
      </div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={{ background: "var(--color-lead-500)" }}
      />
    </div>
  );
}

export default memo(MembersNode);
