import Groq from "groq-sdk";
import { extractJson } from "../utils/json";

import type {
    AIProvider,
    ResumeAnalysis,
    CandidateInsights,
    TrainingRecommendationAnalysis,
    FullEvaluationAnalysis,
} from "../types";

import type { CandidateLike } from "../../evaluation";

import { buildCandidateInsightsPrompt } from "../prompts/candidate-insights.prompt";
import { buildResumeAnalysisPrompt } from "../prompts/resume-analysis.prompt";
import { buildTrainingRecommendationPrompt } from "../prompts/training-recommendation.prompt";
import { buildFullEvaluationPrompt } from "../prompts/evaluation-full.prompt";

export class GroqProvider implements AIProvider {
    private client: Groq;

    constructor() {
        const apiKey = process.env.GROQ_API_KEY;
        console.log("apiKey=",apiKey)

        if (!apiKey) {
            throw new Error("GROQ_API_KEY is missing.");
        }

        this.client = new Groq({
            apiKey,
        });
    }

    private async generate(
        prompt: string,
    ): Promise<string> {
        const response =
            await this.client.chat.completions.create({
                model: "llama-3.3-70b-versatile",

                temperature: 0.2,

                messages: [
                    {
                        role: "system",
                        content:
                            "You are a backend AI service. Return ONLY valid JSON. Never use markdown, code fences, explanations, or extra text.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            });

        const text =
            response.choices?.[0]?.message?.content ?? "";

        if (!text.trim()) {
            throw new Error(
                "Groq returned an empty response.",
            );
        }

        return text.trim();
    }

    async analyzeResume(
        resumeText: string,
    ): Promise<ResumeAnalysis> {
        const prompt =
            buildResumeAnalysisPrompt(resumeText);

        const text =
            await this.generate(prompt);

        const json =
            extractJson<ResumeAnalysis>(text);

        return {
            fullName: json.fullName ?? null,

            email: json.email ?? null,

            phone: json.phone ?? null,

            location: json.location ?? null,

            yearsExperience:
                json.yearsExperience ?? null,

            lastRole:
                json.lastRole ?? null,

            domain:
                json.domain ?? null,

            careerGapMonths: 0,

            skills: Array.isArray(json.skills)
                ? json.skills
                : [],

            rawText: resumeText.slice(0, 4000),
        };
    }

    async generateCandidateInsights(
        candidate: CandidateLike,
    ): Promise<CandidateInsights> {
        const prompt =
            buildCandidateInsightsPrompt(candidate);

        const text =
            await this.generate(prompt);

        const json =
            extractJson<CandidateInsights>(text);

        return {
            strengths: Array.isArray(
                json.strengths,
            )
                ? json.strengths
                : [],

            gaps: Array.isArray(json.gaps)
                ? json.gaps
                : [],

            recommendedUpskilling:
                Array.isArray(
                    json.recommendedUpskilling,
                )
                    ? json.recommendedUpskilling
                    : [],

            recruiterSummary:
                json.recruiterSummary?.trim() ?? "",

            placementRecommendation:
                json.placementRecommendation?.trim() ??
                "",
        };
    }

    async generateTrainingRecommendation(
        candidate: unknown,
    ): Promise<TrainingRecommendationAnalysis> {
        const prompt =
            buildTrainingRecommendationPrompt(
                candidate,
            );

        const text =
            await this.generate(prompt);

        const json =
            extractJson<TrainingRecommendationAnalysis>(
                text,
            );

        return {
            programId: json.programId,

            trainingType:
                json.trainingType,

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
            buildFullEvaluationPrompt(
                candidate,
            );

        const text =
            await this.generate(prompt);

        const json =
            extractJson<FullEvaluationAnalysis>(
                text,
            );

        return json;
    }

}