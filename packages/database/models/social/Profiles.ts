import { getFarcasterUserByEthAddress } from "@cobuild/libs/farcaster/getUser";
import { getShortEthAddress, isEthAddress } from "@cobuild/libs/utils/account";
import { getEnsAvatar, getEnsName, resolveEnsName } from "@cobuild/libs/web3/ens";
import uniq from "lodash/uniq";
import { revalidateTag, unstable_cache } from "next/cache";
import { database } from "../..";
import { Profile } from "../../types";
import { IProfile } from "./IProfile";
import { transformProfile } from "./Profile";

export function Profiles() {
  return {
    get,
    getByUsername,
    getMany,
    update,
  };
}

const get = unstable_cache(
  async (address: `0x${string}`): Promise<IProfile> => {
    if (!isEthAddress(address)) throw new Error("Invalid address");

    const profile = await database.profile.findFirst({
      where: { address: address.toLowerCase() },
      select: {
        profilePicture: true,
        username: true,
        address: true,
        bio: true,
        website: true,
      },
    });

    const res = profile || (await createNew(address));

    return transformProfile(res);
  },
  undefined,
  { revalidate: 1200, tags: ["profile"] },
);

const getByUsername = unstable_cache(
  async (username: string): Promise<IProfile | null> => {
    const profile = await database.profile.findFirst({
      where: { username },
      select: {
        profilePicture: true,
        username: true,
        address: true,
        bio: true,
        website: true,
      },
    });

    return profile ? transformProfile(profile) : null;
  },
  undefined,
  { revalidate: 1200, tags: ["profile"] },
);

const getMany = unstable_cache(
  async (addresses: `0x${string}`[]): Promise<IProfile[]> => {
    const addressesLower: `0x${string}`[] = uniq(
      addresses.map(a => a.toLowerCase()),
    ) as `0x${string}`[];

    const profiles = await database.profile.findMany({
      where: { address: { in: addressesLower } },
      select: { profilePicture: true, username: true, address: true, bio: true, website: true },
    });

    //if there are profiles missing, insert them
    if (profiles.length < addressesLower.length) {
      const missingAddresses = addressesLower.filter(
        address => !profiles.find(profile => profile.address.toLowerCase() === address),
      ) as `0x${string}`[];

      await createMany(uniq(missingAddresses));
    }

    return profiles.map(transformProfile);
  },
  undefined,
  { revalidate: 1200, tags: ["profile"] },
);

const createNew = async (address: `0x${string}`): Promise<Omit<Profile, "id">> => {
  const data = await generateProfile(address);

  try {
    await database.profile.upsert({ where: { address: data.address }, create: data, update: data });
    return data;
  } catch (e) {
    console.error(e);
    return data;
  }
};

interface IBulkWriteOp {
  q: {
    address: `0x${string}`;
  };
  u: {
    $set: {
      address: string;
      username: string;
      profilePicture: string | null;
      updatedAt: Date;
    };
  };
  upsert: boolean;
}

const createMany = async (addresses: `0x${string}`[]): Promise<void> => {
  if (!addresses.length) return;

  const result = await database.$runCommandRaw({
    update: "profiles",
    updates: (await createBulkWriteOps(addresses)) as any,
  });

  console.debug("wrote profiles", result);
};

//create bulk write operations for adding new profiles
const createBulkWriteOps = async (addresses: `0x${string}`[]): Promise<IBulkWriteOp[]> => {
  //do the same thing as above but in a promise.all
  return await Promise.all(
    addresses.map(async address => {
      const data = await generateProfile(address);

      return {
        q: { address: address.toLowerCase() as `0x${string}` },
        u: { $set: { ...data, updatedAt: { $date: new Date() } as any } },
        upsert: true,
      };
    }),
  );
};

async function generateProfile(address: `0x${string}`): Promise<Omit<Profile, "id">> {
  const [ensName, farcUser] = await Promise.all([
    getEnsName(address),
    getFarcasterUserByEthAddress(address),
  ]);

  return {
    address: address.toLowerCase(),
    username: farcUser?.username || ensName || address,
    profilePicture: farcUser?.pfp_url || (ensName ? await getEnsAvatar(ensName) : null),
    bio: farcUser?.profile?.bio?.text || null,
    website: farcUser?.username ? `https://warpcast.com/${farcUser.username}` : null,
    updatedAt: new Date(),
  };
}

async function update(
  address: `0x${string}`,
  data: Pick<IProfile, "username" | "profilePicture" | "bio" | "website">,
) {
  const { username } = data;

  const other = database.profile.count({ where: { username, address: { not: address } } });
  if ((await other) > 0) {
    throw new Error("Username is already taken");
  }

  const ensAddress = await resolveEnsName(username);
  if (ensAddress && ensAddress !== address) {
    throw new Error(`Username reserved for ${getShortEthAddress(ensAddress)}`);
  }

  revalidateTag("profile");
  return await database.profile.update({ where: { address }, data });
}
