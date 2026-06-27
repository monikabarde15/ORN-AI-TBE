import type { CandidateLike } from "../../evaluation";

export function buildFullEvaluationPrompt(
  candidate: CandidateLike,
): string {
  return `
You are a senior European Technical Recruiter, ATS Specialist and Employability Evaluator.

Evaluate the candidate professionally.

Return ONLY valid JSON.

Do NOT return markdown.

Return exactly this JSON structure:

{
  "scores": {
    "cvQuality": 0,
    "technicalSkillMatch": 0,
    "technicalRelevance": 0,
    "englishReadiness": 0,
    "europeJobReadiness": 0,
    "marketReadiness": 0,
    "careerGapRisk": 0,
    "upskillingNeeds": 0,
    "overall": 0
  },

  "readinessTier": "",

  "classification": "",

  "strengths": [],

  "gaps": [],

  "recommendedUpskilling": [],

  "insights": [
    {
      "title": "",
      "detail": "",
      "severity": ""
    }
  ]
}

Rules:

Scores:
- Every score must be between 0 and 100.

readinessTier must be one of:

- emerging
- developing
- ready
- elite

classification must be one of:

- recruiter_ready
- needs_upskilling
- needs_reskilling
- not_ready_yet

insights:

Maximum 5 insights.

severity:

- strength
- opportunity
- gap

Do not invent additional properties.

Candidate:

${JSON.stringify(candidate, null, 2)}
`;
}