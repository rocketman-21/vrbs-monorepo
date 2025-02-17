"use client";

import { Button } from "@cobuild/ui/atoms/Button";
import { useDropMint } from "app/libs/useDropMint";

interface Props {
  chainId: number;
  contract: `0x${string}`;
  tokenId: string;
}

export const DropMintButton = (props: Props) => {
  const { mint, status } = useDropMint(props);

  return (
    <Button size="base" pulse={status !== "idle"} disabled={status !== "idle"} onClick={mint}>
      Mint
    </Button>
  );
};
