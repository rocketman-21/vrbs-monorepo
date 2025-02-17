import { RevolutionAddresses } from "@cobuild/libs/web3/viem/utils/revolutionBuilder";
import { useRevolution } from "app/libs/useRevolution";
import SmartContractItem from "./SmartContractItem";
import { useIsMobile } from "@cobuild/libs/hooks/useIsScreenSize";

export default function SmartContractsList() {
  const { addresses, chainId, points, token, name } = useRevolution();

  if (!addresses) return null;

  return (
    <div className="space-y-6 divide-y divide-zinc-200 dark:divide-zinc-700">
      {Object.entries(addresses).map(([contractName, contractAddress]) => (
        <ContractItem
          key={contractName}
          pointsName={points?.name || ""}
          tokenName={token?.name || ""}
          name={contractName as keyof RevolutionAddresses}
          address={contractAddress}
          chainId={chainId}
          revolutionName={name}
        />
      ))}
    </div>
  );
}

function ContractItem({
  name,
  address,
  chainId,
  pointsName,
  tokenName,
  revolutionName,
}: {
  name: keyof RevolutionAddresses;
  address: `0x${string}`;
  chainId: number;
  pointsName: string;
  tokenName: string;
  revolutionName: string;
}) {
  const [title, description] = getContractDescription(name, pointsName, tokenName, revolutionName);
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col justify-between py-4 md:flex-row md:items-center">
      <SmartContractItem
        title={title}
        condensed={isMobile}
        description={description}
        address={address}
        chainId={chainId}
      />
    </div>
  );
}

const getContractDescription = (
  name: keyof RevolutionAddresses,
  pointsName: string,
  tokenName: string,
  revolutionName: string,
) => {
  switch (name) {
    case "cultureIndex":
      return ["Culture Index", "Stores submissions for the Art Race."];
    case "dao":
      return ["DAO", "Handles proposals and voting."];
    case "points":
      return [pointsName, "Stores voting power ERC20."];
    case "maxHeap":
      return ["Max Heap", "Manages Art Race order."];
    case "token":
      return [`${tokenName} Token`, "The membership collectible."];
    case "vrgda":
      return ["VRGDA", `Controls ${pointsName} issuance.`];
    case "revolutionVotingPower":
      return [`${revolutionName} Voting Power`, `Defines account voting power.`];
    case "pointsEmitter":
      return [`${pointsName} Emitter`, `Sells voting power.`];
    case "splitsCreator":
      return ["Splits Creator", "Manages splits."];
    case "descriptor":
      return ["Descriptor", "Defines collectible metadata."];
    case "auction":
      return ["Auction", "Manages auction and bids."];
    case "executor":
      return ["Executor", "Treasury to execute DAO transactions."];
    default:
      return [name, ""];
  }
};
