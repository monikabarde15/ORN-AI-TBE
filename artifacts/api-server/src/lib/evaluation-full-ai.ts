
import { analyzeSkillGap } from "./skill-gap";
import { generateFullEvaluation } from "./ai-services/evaluation-full.service";
import { evaluate, type CandidateLike, type EvaluationResult } from "./evaluation";

export async function evaluateWithAI(
  candidate: CandidateLike,
): Promise<EvaluationResult> {
  // Ensure resumeText and resumeAnalysis are populated if present inside candidate.cv JSON
  const cvData = candidate.cv as { rawText?: string; resumeAnalysis?: any } | null;
  const enrichedCandidate: CandidateLike = {
    ...candidate,
    resumeText: candidate.resumeText ?? cvData?.rawText ?? null,
    resumeAnalysis: candidate.resumeAnalysis ?? cvData?.resumeAnalysis ?? null,
  };

  console.log("========== CANDIDATE TO AI ==========");
  console.dir(enrichedCandidate, { depth: null });

  // Calculate deterministic fallback evaluation
  const fallbackEval = evaluate(enrichedCandidate);

  let ai = null;
  try {
    ai = await generateFullEvaluation(enrichedCandidate);
    console.log("========== AI RESULT ==========");
    console.dir(ai, { depth: null });
  } catch (err) {
    console.error("Failed to generate AI evaluation, using deterministic evaluation fallback:", err);
  }

  const cvQuality = (ai?.scores?.cvQuality && ai.scores.cvQuality > 0)
    ? ai.scores.cvQuality
    : fallbackEval.scores.cvQuality;

  const technicalRelevance = (ai?.scores?.technicalRelevance && ai.scores.technicalRelevance > 0)
    ? ai.scores.technicalRelevance
    : fallbackEval.scores.technicalRelevance;

  const technicalSkillMatch = (ai?.scores?.technicalSkillMatch && ai.scores.technicalSkillMatch > 0)
    ? ai.scores.technicalSkillMatch
    : (ai?.scores?.technicalRelevance && ai.scores.technicalRelevance > 0)
      ? ai.scores.technicalRelevance
      : fallbackEval.scores.technicalSkillMatch;

  const englishReadiness = (ai?.scores?.englishReadiness && ai.scores.englishReadiness > 0)
    ? ai.scores.englishReadiness
    : fallbackEval.scores.englishReadiness;

  const europeJobReadiness = (ai?.scores?.europeJobReadiness && ai.scores.europeJobReadiness > 0)
    ? ai.scores.europeJobReadiness
    : fallbackEval.scores.europeJobReadiness;

  const careerGapRisk = (typeof ai?.scores?.careerGapRisk === "number")
    ? ai.scores.careerGapRisk
    : fallbackEval.scores.careerGapRisk;

  const marketReadiness = (ai?.scores?.marketReadiness && ai.scores.marketReadiness > 0)
    ? ai.scores.marketReadiness
    : Math.min(100, Math.max(0, Math.round(technicalRelevance * 0.4 + englishReadiness * 0.25 + europeJobReadiness * 0.25 + (100 - careerGapRisk) * 0.1)));

  const upskillingNeeds = (typeof ai?.scores?.upskillingNeeds === "number")
    ? ai.scores.upskillingNeeds
    : Math.max(0, 100 - marketReadiness);

  const overall = (ai?.scores?.overall && ai.scores.overall > 0)
    ? ai.scores.overall
    : Math.min(100, Math.max(0, Math.round(cvQuality * 0.15 + technicalRelevance * 0.3 + englishReadiness * 0.18 + europeJobReadiness * 0.2 + marketReadiness * 0.1 + (100 - careerGapRisk) * 0.07)));

  const skillGap = analyzeSkillGap(
    enrichedCandidate.targetRole,
    enrichedCandidate.skills ?? [],
  );

  return {
    candidateId: enrichedCandidate.id,
    evaluatedAt: new Date().toISOString(),
    scores: {
      cvQuality,
      technicalSkillMatch,
      technicalRelevance,
      englishReadiness,
      europeJobReadiness,
      marketReadiness,
      careerGapRisk,
      upskillingNeeds,
      overall,
    },
    strengths: (ai?.strengths && ai.strengths.length > 0) ? ai.strengths : fallbackEval.strengths,
    gaps: (ai?.gaps && ai.gaps.length > 0) ? ai.gaps : fallbackEval.gaps,
    recommendedUpskilling: (ai?.recommendedUpskilling && ai.recommendedUpskilling.length > 0)
      ? ai.recommendedUpskilling
      : fallbackEval.recommendedUpskilling,
    insights: (ai?.insights && ai.insights.length > 0) ? ai.insights : fallbackEval.insights,
    readinessTier: ai?.readinessTier || fallbackEval.readinessTier,
    classification: ai?.classification || fallbackEval.classification,
    skillGap,
  };
}