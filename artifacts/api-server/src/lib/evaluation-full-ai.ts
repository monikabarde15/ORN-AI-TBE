
// artifacts\api-server\src\lib\evaluation-full-ai.ts
import { analyzeSkillGap } from "./skill-gap";
import { generateFullEvaluation } from "./ai-services/evaluation-full.service";

import type {
  CandidateLike,
  EvaluationResult,
} from "./evaluation";

export async function evaluateWithAI(
  candidate: CandidateLike,
): Promise<EvaluationResult> {
  const ai = await generateFullEvaluation(candidate);
  // console.log("canidate evaluation score :",ai.scores);
  const skillGap = analyzeSkillGap(
    candidate.targetRole,
    candidate.skills ?? [],
  );

  return {
    candidateId: candidate.id,

    evaluatedAt: new Date().toISOString(),

    scores: {
      cvQuality: ai.scores.cvQuality,

      technicalSkillMatch:
        ai.scores.technicalSkillMatch,

      technicalRelevance:
        ai.scores.technicalRelevance,

      englishReadiness:
        ai.scores.englishReadiness,

      europeJobReadiness:
        ai.scores.europeJobReadiness,

      marketReadiness:
        ai.scores.marketReadiness,

      careerGapRisk:
        ai.scores.careerGapRisk,

      upskillingNeeds:
        ai.scores.upskillingNeeds,

      overall:
        ai.scores.overall,
    },

    strengths: ai.strengths,

    gaps: ai.gaps,

    recommendedUpskilling:
      ai.recommendedUpskilling,

    insights: ai.insights,

    readinessTier:
      ai.readinessTier,

    classification:
      ai.classification,

    skillGap,
  };
}