// artifacts\api-server\src\lib\ai\config.ts
export const AI_CONFIG = {
  enabled:process.env.ENABLE_AI_RESUME === "true",

  provider:process.env.AI_PROVIDER ?? "gemini",
};