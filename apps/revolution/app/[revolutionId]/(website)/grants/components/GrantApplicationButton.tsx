"use client";

import { IGrant, Serialized } from "@cobuild/database/types";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { Button } from "@cobuild/ui/atoms/Button";
import { ComponentProps, useState } from "react";
import { GrantApplicationModal } from "./GrantApplicationModal";

type Props = {
  grant: Serialized<IGrant>;
  withDescription?: boolean;
} & ComponentProps<typeof Button>;

export const GrantApplicationButton = (props: Props) => {
  const { grant, children = "Apply", withDescription, ...buttonProps } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, login } = useUser();

  return (
    <>
      <GrantApplicationModal
        grant={grant}
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        withDescription={withDescription}
      />
      <Button
        onClick={() => {
          if (isAuthenticated) {
            setIsOpen(true);
          } else {
            login();
          }
        }}
        {...buttonProps}
      >
        {children}
      </Button>
    </>
  );
};
