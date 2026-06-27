// artifacts\api-server\src\lib\candidate-insights-ai.ts
import { generateCandidateInsights } from "./ai-services/candidate-insights.service";
import type { CandidateLike } from "./evaluation";

export async function generateInsightsWithAI(
  candidate: CandidateLike,
) {
  return generateCandidateInsights(candidate);
}