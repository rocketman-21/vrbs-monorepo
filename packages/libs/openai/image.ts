import "server-only";

import { PinataServerSide } from "../storage/PinataServer";
import { recordUserUsage } from "../user/usage-limiter";
import { openai } from "./client";

export async function generateImage(prompt: string, address: `0x${string}`) {
  try {
    recordUserUsage(address, "openai");

    console.debug("Generating image for prompt:", prompt);

    const images = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      model: "dall-e-3",
      response_format: "b64_json",
    });

    const imageData = images.data[0].b64_json;
    if (!imageData) throw new Error("Image generation failed");

    const { url } = await PinataServerSide.upload(
      Buffer.from(imageData, "base64"),
      "image.png",
      "image/png",
    );
    if (!url) throw new Error("Failed to upload image");

    console.debug("Image generated and uploaded to", url);
    return url;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.msg || "Failed to generate image");
  }
}
