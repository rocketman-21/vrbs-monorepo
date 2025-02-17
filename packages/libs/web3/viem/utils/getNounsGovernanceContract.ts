import { getContract } from "viem";
import { getClient } from "../clients";
import { unstable_cache } from "next/cache";
import { reportApiError } from "../../../utils/apiError";
import { nounsBuilderManagerV1Abi } from "../../wagmi";
import { mainnet } from "viem/chains";

const NOUNS_BUILDER_MAINNET = "0xd310a3041dfcf14def5ccbc508668974b5da7174";

//get proxy contracts for token
export const getNounsMainnetGovernanceContract = unstable_cache(
  async (tokenContract: `0x${string}` | null): Promise<`0x${string}` | null> => {
    if (!tokenContract) return null;
    try {
      if (tokenContract.toLowerCase() === "0x558bfff0d583416f7c4e380625c7865821b8e95c") {
        return "0x156e94a6e16244ccfdf16e1193198ea9d80dd7e3";
      }
      if (tokenContract.toLowerCase() === "0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b") {
        return "0x5d2c31ce16924c2a71d317e5bbfd5ce387854039";
      }
      if (tokenContract.toLowerCase() === "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03") {
        return "0x6f3e6272a167e8accb32072d08e0957f9c79223d";
      }
      if (tokenContract.toLowerCase() === "0x36b2aa1795d8cdef4b784fe34045fadc45d61e8c") {
        return "0x5e5031627408fc2a75c8560f9c84548c1de6fe37";
      }
      return await nounsBuilderDAOMainnetAddresses(tokenContract);
    } catch (e) {
      console.error(e);
      reportApiError(e, { tokenContract }, "get-nouns-governance-addresses");
      return null;
    }
  },
  undefined,
  { revalidate: 180, tags: ["nouns-gov-contracts"] },
);

const nounsBuilderDAOMainnetAddresses = async (
  tokenAddress: `0x${string}`,
): Promise<`0x${string}` | null> => {
  const contract = getContract({
    address: NOUNS_BUILDER_MAINNET,
    abi: nounsBuilderManagerV1Abi,
    client: { public: getClient(mainnet.id) },
  });

  const addresses = await contract.read.getAddresses([tokenAddress]);

  return addresses[3];
};
