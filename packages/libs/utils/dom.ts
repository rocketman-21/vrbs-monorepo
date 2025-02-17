/**
 * Determine if viewing device is web browser
 *
 * @returns {boolean}
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Set time break between actions, i.e. sleeping before next step
 *
 * @param {number} ms sleep time in milliseconds
 * @returns {boolean}
 */
export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
