import { unstable_cache } from "next/cache";
import { PinataStorage } from "./Pinata";

interface ZoraMintData {
  name: string;
  description: string;
  image?: string;
  animation_url?: string;
  content: {
    mime: string;
    uri: string;
  };
}

// upload zora mint data to ipfs as json
export const uploadZoraMintData = async (
  name: string,
  description: string,
  content: { mime: string; uri: string },
  image?: string,
  animation_url?: string,
) => {
  const data = {
    name,
    description,
    image,
    animation_url,
    content,
  };
  const { url, ipfsHash } = await PinataStorage.uploadJSON(data);
  return { url, ipfsHash };
};
