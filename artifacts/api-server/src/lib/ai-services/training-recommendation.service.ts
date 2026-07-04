import { getAIProvider } from "../ai/factory";
import type {
  TrainingRecommendationAnalysis,
  LearningPathAIInput,
} from "../ai/types";

export async function generateTrainingRecommendation(
  candidate: unknown,
  learningPaths: LearningPathAIInput[],
): Promise<TrainingRecommendationAnalysis> {
  const provider = getAIProvider();

  return provider.generateTrainingRecommendation(
    candidate,
    learningPaths,
  );
}