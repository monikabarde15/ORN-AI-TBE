import { AIProvider } from "./types";
// import { GeminiProvider } from "./providers/gemini.provider";
// import { OpenAIProvider } from "./providers/openai.provider";
// import { ClaudeProvider } from "./providers/claude.provider";
import { GroqProvider } from "./providers/groq.provider";
export function getAIProvider(): AIProvider {
  const provider =
    process.env.AI_PROVIDER?.toLowerCase() ??
    "gemini";

  switch (provider) {

    // case "gemini": return new GeminiProvider();

      case "groq": return new GroqProvider();

    // case "openai": return new OpenAIProvider();

    // case "claude": return new ClaudeProvider();

    default:
      return new GroqProvider();
  }
}