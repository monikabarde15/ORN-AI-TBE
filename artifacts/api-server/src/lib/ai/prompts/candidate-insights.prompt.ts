// artifacts\api-server\src\lib\ai\prompts\candidate-insights.prompt.ts
import type { CandidateLike } from "../../evaluation";

export function buildCandidateInsightsPrompt(
  candidate: CandidateLike,
): string {
  return `
You are a senior European technical recruiter.

Analyze this candidate.

Return ONLY valid JSON.

Do not use markdown.

Return exactly this JSON:

{
  "strengths": [],
  "gaps": [],
  "recommendedUpskilling": [],
  "recruiterSummary": "",
  "placementRecommendation": ""
}

Rules:

- strengths = max 5
- gaps = max 5
- recommendedUpskilling = max 5
- recruiterSummary = 2-3 sentences
- placementRecommendation = 1 sentence

Candidate:

${JSON.stringify(candidate, null, 2)}
`;
}