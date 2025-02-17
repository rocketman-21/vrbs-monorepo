"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { useDropMint } from "app/libs/useDropMint";

interface Props {
  chainId: number;
  contract: `0x${string}`;
  tokenId: string;
}

export const DropMint = (props: Props) => {
  const { mint, status } = useDropMint(props);

  return (
    <Button
      size="lg"
      className="lg:max-w-xs"
      pulse={status !== "idle"}
      disabled={status !== "idle"}
      onClick={mint}
    >
      Mint
    </Button>
  );
};
