import { CastWithInteractions } from "./client";

const BANNED_SPAM_WORDS = ["$degen"];

export function farcasterSpam(cast: CastWithInteractions) {
  return !BANNED_SPAM_WORDS.some(word => cast.text.toLowerCase().includes(word));
}
