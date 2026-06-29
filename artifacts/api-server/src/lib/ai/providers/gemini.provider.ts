import { GoogleGenAI } from "@google/genai";
import { extractJson } from "../utils/json";
import type {
  AIProvider,
  ResumeAnalysis,
  CandidateInsights,
  TrainingRecommendationAnalysis ,
  FullEvaluationAnalysis,
} from "../types";

import type { CandidateLike } from "../../evaluation";

import { buildCandidateInsightsPrompt } from "../prompts/candidate-insights.prompt";
import { buildResumeAnalysisPrompt } from "../prompts/resume-analysis.prompt";
import { buildTrainingRecommendationPrompt } from "../prompts/training-recommendation.prompt";
import { buildFullEvaluationPrompt } from "../prompts/evaluation-full.prompt";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing.");
    }

    this.client = new GoogleGenAI({
      apiKey,
    });
  }

  async analyzeResume(
    resumeText: string,
  ): Promise<ResumeAnalysis> {
    const prompt = buildResumeAnalysisPrompt(resumeText);

    const response = await this.client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = (response.text ?? "").trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const json = extractJson<ResumeAnalysis>(text);

    return {
      fullName: json.fullName ?? null,
      email: json.email ?? null,
      phone: json.phone ?? null,
      location: json.location ?? null,
      yearsExperience: json.yearsExperience ?? null,
      lastRole: json.lastRole ?? null,
      domain: json.domain ?? null,

      // placeholder
      careerGapMonths:
                typeof json.careerGapMonths === "number"
                    ? json.careerGapMonths
                    : 0,

      skills: Array.isArray(json.skills)
        ? json.skills
        : [],

      // preserve existing contract
      rawText: resumeText.slice(0, 4000),
    };
  }

  async generateCandidateInsights(
    candidate: CandidateLike,
  ): Promise<CandidateInsights> {
    const prompt = buildCandidateInsightsPrompt(candidate);

    const response = await this.client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "";

    const json = extractJson<CandidateInsights>(text);

    return {
      strengths: Array.isArray(json.strengths)
        ? json.strengths
        : [],

      gaps: Array.isArray(json.gaps)
        ? json.gaps
        : [],

      recommendedUpskilling: Array.isArray(
        json.recommendedUpskilling,
      )
        ? json.recommendedUpskilling
        : [],

      recruiterSummary:
        json.recruiterSummary?.trim() ?? "",

      placementRecommendation:
        json.placementRecommendation?.trim() ?? "",
    };
  }

  async generateTrainingRecommendation(
    candidate: unknown,
  ): Promise<TrainingRecommendationAnalysis> {
    const prompt =
      buildTrainingRecommendationPrompt(candidate);

    const response =
      await this.client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    const text = response.text ?? "";

    const json =
      extractJson<TrainingRecommendationAnalysis>(
        text,
      );

    return {
      programId: json.programId,

      trainingType: json.trainingType,

      assessmentCategory:
        json.assessmentCategory,

      rationale:
        json.rationale?.trim() ?? "",

      confidence:
        typeof json.confidence === "number"
          ? json.confidence
          : 0,
    };
  }

  async generateFullEvaluation(
    candidate: CandidateLike,
  ): Promise<FullEvaluationAnalysis> {
    const prompt =
      buildFullEvaluationPrompt(candidate);

    const response =
      await this.client.models.generateContent({
        model: "gemini-2.5-flash",

        contents: prompt,
      });

    const text =
      response.text?.trim() ?? "";

    const cleaned = text
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/, "")
      .trim();

    return JSON.parse(
      cleaned,
    ) as FullEvaluationAnalysis;
  }

 
}