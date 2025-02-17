import "server-only";

import axios from "axios";
import FormData from "form-data";
import fs from "fs";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const pinataJwt = process.env.NEXT_PUBLIC_PINATA_API_JWT;
const pinataBaseUrl = "https://revolution.mypinata.cloud";

export const PinataServerSide = {
  async upload(buffer: Buffer, filename: string, contentType: string) {
    const formData = new FormData();
    formData.append("file", buffer, { filename, contentType });
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${(formData as any)._boundary}`,
          Authorization: `Bearer ${pinataJwt}`,
        },
      });

      const url = `${pinataBaseUrl}/ipfs/${res.data.IpfsHash}`;
      return { url, ipfsHash: res.data.IpfsHash as string };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to upload to Pinata");
    }
  },

  async uploadSvg(svgData: string) {
    return await this.upload(Buffer.from(svgData, "utf-8"), "image.svg", "image/svg+xml");
  },

  async uploadFile(file: File) {
    const buffer = await file.arrayBuffer();
    return await this.upload(Buffer.from(buffer), file.name, file.type);
  },

  async uploadServerSide(filePath: string) {
    const formData = new FormData();
    const file = fs.createReadStream(filePath);
    formData.append("file", file);

    const options = JSON.stringify({
      cidVersion: 1,
    });

    formData.append("pinataOptions", options);

    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${(formData as any)._boundary}`,
          Authorization: `Bearer ${pinataJwt}`,
        },
      });

      const url = `${pinataBaseUrl}/ipfs/${res.data.IpfsHash}`;
      return { url, ipfsHash: res.data.IpfsHash as string };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to upload to Pinata");
    }
  },
};
