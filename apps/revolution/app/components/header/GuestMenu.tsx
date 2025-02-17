"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { useUser } from "@cobuild/libs/hooks/useUser";

export const GuestMenu = () => {
  const { login } = useUser();

  return <Button onClick={() => login()}>Sign in</Button>;
};
