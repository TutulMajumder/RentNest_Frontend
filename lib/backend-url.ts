/**
 * Backend base URL, sanitised — `.trim()` + no trailing slash.
 * A stray space in `.env` otherwise makes every `fetch` throw "Failed to parse URL".
 */
export const BACKEND_URL = (process.env.BACKEND_API_URL ?? "")
  .trim()
  .replace(/\/+$/, "");
