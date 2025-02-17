import { SocialLinks } from "@cobuild/libs/revolution/interfaces";
import { nonNullable } from "@cobuild/libs/utils/data";
import SvgDiscord from "@cobuild/ui/icons/Discord";
import SvgFarcaster from "@cobuild/ui/icons/Farcaster";
import SvgGithub from "@cobuild/ui/icons/Github";
import SvgTwitter from "@cobuild/ui/icons/Twitter";
import SvgTelegram from "@cobuild/ui/icons/Telegram";

export function getRevolutionSocials(socials: SocialLinks) {
  if (!socials) return [];

  if (!socials.github) {
    socials.github = "https://github.com/collectivexyz/revolution-protocol";
  }

  return Object.keys(socials)
    .map(platform => {
      const Icon = getSocialIcon(platform as keyof SocialLinks);
      if (!Icon) return null;
      return { url: socials[platform as keyof typeof socials] as string, Icon, name: platform };
    })
    .filter(nonNullable);
}

function getSocialIcon(platform: keyof SocialLinks) {
  switch (platform) {
    case "twitter":
      return SvgTwitter;
    case "discord":
      return SvgDiscord;
    case "github":
      return SvgGithub;
    case "farcaster":
      return SvgFarcaster;
    case "telegram":
      return SvgTelegram;
    default:
      return null;
  }
}
