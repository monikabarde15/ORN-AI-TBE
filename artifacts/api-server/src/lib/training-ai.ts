import {
  defaultTrainerForProgram,
  findProgramById,
} from "./training-catalog";

import type {
  RecommendationResult,
} from "./training";

import { generateTrainingRecommendation } from "./ai-services/training-recommendation.service";

interface MinCandidate {
  id: string;
  targetRole: string;
  evaluation: unknown;
}

export async function recommendTrainingWithAI(
  candidate: MinCandidate,
): Promise<RecommendationResult> {
  const ai = await generateTrainingRecommendation(candidate);

  const program = findProgramById(ai.programId);

  if (!program) {
    throw new Error(
      `Unknown AI program id: ${ai.programId}`,
    );
  }

  const trainer =
    defaultTrainerForProgram(program.id);

  return {
    assessmentCategory:
      ai.assessmentCategory,

    trainingType:
      ai.trainingType,

    recommendedPath:
      program.recommendedPath,

    program,

    suggestedTrainer: trainer,

    rationale:
      ai.rationale,
  };
}