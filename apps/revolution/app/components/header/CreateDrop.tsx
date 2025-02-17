import "server-only";

import { IRevolution } from "@cobuild/database/types";
import { getDropCurrentTokenId } from "@cobuild/libs/web3/zora-drop/current-token-id";
import { getMintHouseInterval } from "@cobuild/libs/web3/zora-drop/mint-house";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { getDrop } from "app/[revolutionId]/(website)/drop/components/getDrop";
import { Countdown } from "../Countdown";
import { CreateDropButton } from "./CreateDropButton";

interface Props {
  revolution: IRevolution;
}

export const CreateDrop = async (props: Props) => {
  const { revolution } = props;
  const { addresses, chainId, revolutionId } = revolution;

  if (!addresses?.mintHouse || !addresses.drop) return null;

  const currentTokenId = await getDropCurrentTokenId(addresses.drop, chainId);
  if (!currentTokenId) return null;

  const latestDrop = await getDrop(revolutionId, currentTokenId);
  const interval = await getMintHouseInterval(addresses.mintHouse, chainId);

  const dropAvailabilityDate = new Date(
    (Number(latestDrop?.saleConfig.saleStart) + Number(interval)) * 1000,
  );

  const canDrop = new Date() > dropAvailabilityDate;

  return (
    <Tooltip
      title={canDrop ? undefined : "Available in:"}
      subtitle={canDrop ? undefined : <Countdown targetTime={dropAvailabilityDate.toISOString()} />}
    >
      <CreateDropButton disabled={!canDrop} chainId={chainId} contract={addresses.mintHouse} />
    </Tooltip>
  );
};
