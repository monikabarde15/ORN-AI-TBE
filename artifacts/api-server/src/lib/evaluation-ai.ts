// artifacts\api-server\src\lib\evaluation-ai.ts
import type { EvaluationResult, CandidateLike } from "./evaluation";
import { generateInsightsWithAI } from "./candidate-insights-ai";

export async function enhanceEvaluationWithAI(
  candidate: CandidateLike,
  evaluation: EvaluationResult,
): Promise<EvaluationResult> {
  const ai = await generateInsightsWithAI(candidate);

  return {
    ...evaluation,

    strengths:
      ai.strengths.length > 0
        ? ai.strengths
        : evaluation.strengths,

    gaps:
      ai.gaps.length > 0
        ? ai.gaps
        : evaluation.gaps,

    recommendedUpskilling:
      ai.recommendedUpskilling.length > 0
        ? ai.recommendedUpskilling
        : evaluation.recommendedUpskilling,

    insights: [
      ...evaluation.insights,

      {
        title: "AI Recruiter Summary",
        detail: ai.recruiterSummary,
        severity: "strength",
      },

      {
        title: "Placement Recommendation",
        detail: ai.placementRecommendation,
        severity: "opportunity",
      },
    ],
  };
}