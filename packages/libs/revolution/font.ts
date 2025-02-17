import { Public_Sans, Roboto_Mono } from "next/font/google";
import { getRevolutionConfig } from "./config";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export function getFontForRevolution(revolutionId: string) {
  const { font = "Public Sans" } = getRevolutionConfig(revolutionId);

  switch (font) {
    case "Public Sans":
      return { ...publicSans, tailwindClass: "font-public-sans" };
    case "Roboto Mono":
      return { ...robotoMono, tailwindClass: "font-roboto-mono" };
    default:
      throw new Error("Invalid font");
  }
}
