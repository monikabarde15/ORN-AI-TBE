export * from "./generated/api";
export * from "./generated/api.schemas";
export {
  setBaseUrl,
  setAuthTokenGetter,
  ApiError,
  ResponseParseError,
} from "./custom-fetch";
export type { AuthTokenGetter, ErrorType } from "./custom-fetch";

import { setBaseUrl } from "./custom-fetch";

setBaseUrl(import.meta.env.VITE_API_BASE_URL);
console.log("API URL =>", import.meta.env.VITE_API_BASE_URL);