import type { RecommendationResult } from "../../training";

export function buildTrainingRecommendationPrompt(
  candidate: unknown,
): string {
  return `
You are an expert European technical recruiter and employability advisor.

Your task is to recommend ONE training program.

IMPORTANT:

Only choose ONE of these program ids.

- prog_eu_workplace_english
- prog_cloud_devops
- prog_data_engineering
- prog_ai_ml_bridge
- prog_leadership
- prog_eu_compliance

Rules:

- Never invent a program id.
- Return valid JSON only.
- Do not return markdown.

Return exactly:

{
  "programId": "",
  "trainingType": "",
  "assessmentCategory": "",
  "rationale": "",
  "confidence": 0
}

Where:

trainingType:
- upskilling
- reskilling

assessmentCategory:
- needs_upskilling
- needs_reskilling

confidence:
0-100

Candidate:

${JSON.stringify(candidate, null, 2)}
`;
}