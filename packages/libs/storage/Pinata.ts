import axios, { AxiosProgressEvent } from "axios";
import wretch from "wretch";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const pinataJwt = process.env.NEXT_PUBLIC_PINATA_API_JWT;
const pinataBaseUrl = "https://revolution.mypinata.cloud";

interface UploadProgressCallback {
  (progressEvent: AxiosProgressEvent): void;
}

export const PinataStorage = {
  async upload(file: File | null, onUploadProgress?: UploadProgressCallback) {
    const formData = new FormData();

    if (file) {
      formData.append("file", file, file.name);
    }

    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${pinataJwt}`,
      },
      onUploadProgress,
    });

    return { url: `${pinataBaseUrl}/ipfs/${response.data.IpfsHash}` };
  },
  async uploadJSON(data: any) {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const formData = new FormData();
    formData.append("file", blob, "data.json");
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${pinataJwt}`,
          },
        },
      );

      const url = `${pinataBaseUrl}/ipfs/${response.data.IpfsHash}`;
      return { url, ipfsHash: response.data.IpfsHash as string };
    } catch (error) {
      console.error("Error uploading JSON to Pinata:", error);
      throw new Error("Failed to upload JSON to Pinata");
    }
  },
};

export async function pinByHash(hashToPin: string) {
  if (!hashToPin || hashToPin.length < 10) return;

  try {
    const response = await wretch("https://api.pinata.cloud/pinning/pinByHash")
      .auth(`Bearer ${pinataJwt}`)
      .options({ next: { revalidate: 60 } })
      .post({ hashToPin })
      .json<{ ipfsHash: string; status: string }>();

    console.debug(`Pinned ${response.ipfsHash}. Status: ${response.status}`);

    return response.status;
  } catch (error: any) {
    throw new Error(`Failed to pin CID to Pinata: ${error?.message}`);
  }
}

export async function downloadPinataFile(ipfsHash: string, retry = true) {
  const url = `${pinataBaseUrl}/ipfs/${ipfsHash}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (retry) {
      await pinByHash(ipfsHash);
      return await downloadPinataFile(ipfsHash, false);
    } else {
      console.error({ ipfsHash, retry });
      throw new Error(`Failed to download from Pinata: ${response.statusText}`);
    }
  }

  return await response.json();
}

//download pinata file from nftstorage
// `https://${hash}.ipfs.nftstorage.link`);
export async function downloadNFTStorageFile(ipfsHash: string) {
  if (!ipfsHash) return null;

  const url = `https://nftstorage.link/ipfs/${ipfsHash}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.error({ ipfsHash });
    throw new Error(`Failed to download from NFTStorage: ${response.statusText}`);
  }

  return await response.json();
}

export async function getPinJobs() {
  try {
    const response = await wretch("https://api.pinata.cloud/pinning/pinJobs")
      .auth(`Bearer ${pinataJwt}`)
      .options({ next: { revalidate: 0 } })
      .get()
      .json<{ count: number; rows: Array<PinataRow> }>();

    return response;
  } catch (error: any) {
    throw new Error(`Failed to get Pinata Jobs: ${error?.message}`);
  }
}

interface PinataRow {
  id: string;
  ipfs_pin_hash: string;
  date_queued: string;
  name: string;
  status: string;
  keyvalues: any;
  host_nodes: string[];
  pin_policy: PinPolicy;
}

interface PinPolicy {
  regions: Region[];
  version: number;
}

interface Region {
  id: string;
  desiredReplicationCount: number;
}
