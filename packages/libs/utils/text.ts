const TRUNCATE_SUFFIX = "...";

/**
 * Word count calculation method
 * @param {string} str
 * @returns {number} number of words found in string
 */
export const wordCount = (str: string): { length: number; words: string[] } => {
  const words = str.split(" ").filter((s: string) => s !== "");

  return { length: words.length, words };
};

const getTruncatedWordsSting = (text: string, max: number): string => {
  const { length, words } = wordCount(text);

  return length > max ? `${words.slice(0, max).join(" ")}${TRUNCATE_SUFFIX}` : text;
};

function getTruncatedLettersString(text: string, max: number) {
  if (text.length <= max + TRUNCATE_SUFFIX.length) return text;
  return `${text.substring(0, max)}${TRUNCATE_SUFFIX}`;
}

/**
 * Text shortening method that caps string, and places '...' at end
 * @param {string} address
 * @returns {string} shortened eth address
 */
export const truncateString = (
  text: string,
  length: number,
  type: "letters" | "words" = "letters",
): string => {
  switch (type) {
    case "words":
      return getTruncatedWordsSting(text, length);
    case "letters":
    default:
      return getTruncatedLettersString(text, length);
  }
};

/**
 * Converts Markdown formatted text to plain text by stripping Markdown syntax.
 * @param {string} markdownText - The Markdown formatted text.
 * @return {string} - The plain text without Markdown formatting.
 */
export function markdownToPlainText(markdownText: string) {
  // Regular expression to match Markdown syntax patterns
  const markdownRegex =
    /(\*\*|__)(.*?)\1|\[(.*?)\]\(.*?\)|\!\[.*?\]\(.*?\)|\*|_|`|#+|\>\s|!\[\]\(.*?\)/g;
  // Replace Markdown syntax with plain text
  return markdownText.replace(markdownRegex, "$2$3");
}
