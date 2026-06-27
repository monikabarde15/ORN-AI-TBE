import { getAIProvider } from "../ai/factory";
import type { TrainingRecommendationAnalysis } from "../ai/types";

export async function generateTrainingRecommendation(
  candidate: unknown,
): Promise<TrainingRecommendationAnalysis> {
  const provider = getAIProvider();

  return provider.generateTrainingRecommendation(candidate);
}