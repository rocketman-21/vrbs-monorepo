"use client";

import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { Button } from "@cobuild/ui/atoms/Button";
import SvgPlus from "@cobuild/ui/pixel-icons/Plus";
import { useRevolution } from "app/libs/useRevolution";

export const AuctionPreLaunchCTA = () => {
  const [_, setShowCreateModal] = useUrlState("create");
  const { descriptor } = useRevolution();
  const { isAuthenticated, login } = useUser();

  return (
    <Button
      onClick={() => {
        if (!isAuthenticated) return login();
        setShowCreateModal("true");
      }}
      size="lg"
      color="primary"
    >
      <SvgPlus className="mr-1 size-4" /> Create the next {descriptor?.tokenNamePrefix}
    </Button>
  );
};
