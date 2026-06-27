// artifacts\api-server\src\lib\ai-services\candidate-insights.service.ts
import { getAIProvider } from "../ai/factory";
import type { CandidateLike } from "../evaluation";

export async function generateCandidateInsights(
  candidate: CandidateLike,
) {
  const provider = getAIProvider();

  return provider.generateCandidateInsights(candidate);
}