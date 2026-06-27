// artifacts\api-server\src\lib\ai\prompts\resume-analysis.prompt.ts
export function buildResumeAnalysisPrompt(
  resumeText: string,
): string {
  return `
You are an expert technical recruiter and resume parser.

Your task is to extract structured information from a resume.

Rules:

- Return ONLY valid JSON.
- Do NOT wrap JSON inside markdown.
- Do NOT explain anything.
- Do NOT include extra fields.
- If a value cannot be determined, return null.
- skills must always be an array.
- yearsExperience must be an integer.
- Return only one domain.
- Domain MUST be one of:

[
  "Fintech",
  "Healthcare",
  "E-commerce",
  "SaaS",
  "Banking",
  "Telecom",
  "Insurance",
  "Logistics",
  "Gaming",
  "EdTech",
  "Cybersecurity"
]

If none match, return relatively close to it.

Return this exact JSON:

{
  "fullName": null,
  "email": null,
  "phone": null,
  "location": null,
  "yearsExperience": null,
  "lastRole": null,
  "domain": null,
  "skills": []
}

Resume:

${resumeText}
`;
}