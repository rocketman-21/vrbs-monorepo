import gifff from "gifff/canvas";

export async function getGifThumbnail(file: File) {
  if (file.type !== "image/gif") {
    return null;
  }

  const blob = await gifff(file);
  const fileName = `${file.name.split(".")[0]}_thumbnail.${file.name.split(".")[1]}`;
  return new File([blob], fileName, { type: "image/png" });
}
