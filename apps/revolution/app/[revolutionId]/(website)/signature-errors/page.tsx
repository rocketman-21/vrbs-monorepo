import {
  baseContestAbi,
  contestBuilderAbi,
  cultureIndexAbi,
  revolutionDaoLogicV1Abi,
  revolutionPointsAbi,
  revolutionPointsEmitterAbi,
} from "@cobuild/revolution";
import { encodeErrorResult } from "viem";
import { getExistingVoteAllocationTxns } from "@cobuild/libs/web3/explorer-api/explorerApi";
import RewriteVoteAllocations from "./RewriteVoteAllocations";

interface Props {
  params: {
    revolutionId: string;
  };
}

export default async function GrantApplyPage(props: Props) {
  const abis = {
    emitter: revolutionPointsEmitterAbi,
    points: revolutionPointsAbi,
    cultureIndex: cultureIndexAbi,
    dao: revolutionDaoLogicV1Abi,
    contestBuilder: contestBuilderAbi,
    baseContest: baseContestAbi,
  };

  const pastGrantsVotes = await getExistingVoteAllocationTxns();

  const errorSignatures = Object.entries(abis).reduce(
    (acc, [key, abi]) => {
      const errors = abi
        .filter(d => d.type === "error")
        .map(error => ({
          name: (error as any).name,
          signature: encodeErrorResult({
            abi,
            errorName: (error as any).name,
          }),
        }));
      acc[key] = errors;
      return acc;
    },
    {} as Record<string, { name: string; signature: string }[]>,
  );

  return (
    <main className="mt-24 md:mt-28">
      <RewriteVoteAllocations
        recipients={pastGrantsVotes.recipients}
        voters={pastGrantsVotes.voters}
        allocations={pastGrantsVotes.allocations}
      />

      {Object.entries(errorSignatures).map(([name, errors]) => (
        <ErrorSection key={name} name={name} errors={errors} />
      ))}
    </main>
  );
}

interface ErrorSectionProps {
  name: string;
  errors: { name: string; signature: string }[];
}

const ErrorSection = (props: ErrorSectionProps) => {
  return (
    <main className="mt-24 md:mt-28">
      <h1 className="px-6 text-lg font-bold">{props.name} </h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Signature
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {props.errors.map((signature, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {signature.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {signature.signature}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};
