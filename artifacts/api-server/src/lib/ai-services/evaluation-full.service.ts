import { getAIProvider } from "../ai/factory";
import type { CandidateLike } from "../evaluation";

export async function generateFullEvaluation(
  candidate: CandidateLike,
) {
  const provider = getAIProvider();

  return provider.generateFullEvaluation(candidate);
}