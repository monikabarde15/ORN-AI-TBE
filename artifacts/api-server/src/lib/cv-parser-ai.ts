// artifacts\api-server\src\lib\cv-parser-ai.ts
import { analyzeResume } from "./ai-services/resume-analysis.service";
import type { ExtractedProfile } from "./cv-parser";
import {
  detectCareerGapMonths,
} from "./cv-parser";
/**
 * AI Resume Parser
 *
 * Input:
 *  Raw resume text
 *
 * Output:
 *  Same ExtractedProfile returned by the legacy parser.
 *
 * This file intentionally does NOT:
 * - parse PDFs
 * - detect career gaps
 * - contain Gemini logic
 *
 * Those responsibilities belong elsewhere.
 */
export async function parseCvWithAI(
  rawText: string,
): Promise<ExtractedProfile> {

  console.log("🤖 AI Resume Parser Started");
  const result = await analyzeResume(rawText);
  
  console.log("\n================ AI RESUME ANALYSIS ================");

  console.log("Full Name        :", result.fullName);
  console.log("Email            :", result.email);
  console.log("Phone            :", result.phone);
  console.log("Location         :", result.location);

  console.log("Years Experience :", result.yearsExperience);
  console.log("Career Gap       :", result.careerGapMonths);

  console.log("Last Role        :", result.lastRole);
  console.log("Domain           :", result.domain);

  console.log("Skills Count     :", result.skills.length);
  console.log("Skills           :", result.skills);

  console.log("===================================================\n");

  return {
    fullName: result.fullName,
    email: result.email,
    phone: result.phone,
    location: result.location,
    yearsExperience: result.yearsExperience,
    lastRole: result.lastRole,
    domain: result.domain,

    /**
     * Keep legacy implementation for now.
     * We'll replace this later if needed.
     */
    // careerGapMonths:detectCareerGapMonths(rawText),
    careerGapMonths: result.careerGapMonths,

    skills: result.skills,

    rawText: rawText.slice(0, 4000),
  };
}