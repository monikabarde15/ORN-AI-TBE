// artifacts\api-server\src\lib\ai\providers\groq.provider.ts
import Groq from "groq-sdk";
import { extractJson } from "../utils/json";

import type {
    AIProvider,
    ResumeAnalysis,
    CandidateInsights,
    TrainingRecommendationAnalysis,
    FullEvaluationAnalysis,
    LearningPathAIInput,
} from "../types";

import type { CandidateLike } from "../../evaluation";

import { buildCandidateInsightsPrompt } from "../prompts/candidate-insights.prompt";
import { buildResumeAnalysisPrompt } from "../prompts/resume-analysis.prompt";
import { buildTrainingRecommendationPrompt } from "../prompts/training-recommendation.prompt";
import { buildFullEvaluationPrompt } from "../prompts/evaluation-full.prompt";
import {calculateYearsExperience,calculateCareerGapMonths,} from "../utils/employment";

export class GroqProvider implements AIProvider {
    private client: Groq;

    constructor() {


        const apiKey = process.env.GROQ_API_KEY;
        // console.log("apiKey=",apiKey)

        // console.log("Api Key Called", apiKey);

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
        try {
            const models = ["llama-3.3-70b-versatile", "llama-3.1-70b-versatile", "llama3-70b-8192", "mixtral-8x7b-32768"];
            let lastErr: any = null;
            for (const model of models) {
                try {
                    const response = await this.client.chat.completions.create({
                        model,
                        temperature: 0.2,
                        messages: [
                            {
                                role: "system",
                                content: "You are a backend AI service. Return ONLY valid JSON. Never use markdown, code fences, explanations, or extra text.",
                            },
                            {
                                role: "user",
                                content: prompt,
                            },
                        ],
                    });
                    const text = response.choices?.[0]?.message?.content ?? "";
                    if (text.trim()) return text.trim();
                } catch (e: any) {
                    lastErr = e;
                }
            }
            throw lastErr || new Error("Groq returned an empty response.");
        } catch (err: any) {
            console.warn("Groq generate fallback:", err?.message || err);
            return "{}";
        }
    }

    async analyzeResume(
        resumeText: string,
    ): Promise<ResumeAnalysis> {
        const prompt = buildResumeAnalysisPrompt(resumeText);

        const text = await this.generate(prompt);

        console.log("Raw AI Response:");
        console.log(text);

        const json = extractJson<ResumeAnalysis>(text);

        console.log("Parsed AI JSON:");
        console.log(json);

    
        console.log(
            "Career Gap:",
            calculateCareerGapMonths(
                json.employmentHistory ?? [],
            ),
        );
        console.log("=========================================\n");

        return {
            fullName: json.fullName ?? null,

            email: json.email ?? null,

            phone: json.phone ?? null,

            location: json.location ?? null,

            yearsExperience:
                calculateYearsExperience(
                    json.employmentHistory ?? [],
                ),

            lastRole:
                json.lastRole ?? null,

            domain:
                json.domain ?? null,

            careerGapMonths:
                calculateCareerGapMonths(
                    json.employmentHistory ?? [],
                ),

            skills: Array.isArray(json.skills)
                ? json.skills
                : [],

            employmentHistory: Array.isArray(json.employmentHistory)
                ? json.employmentHistory
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
        learningPaths: LearningPathAIInput[],
    ): Promise<TrainingRecommendationAnalysis> {
        const prompt =
            buildTrainingRecommendationPrompt(
                candidate,
                learningPaths,
            );

        const text =
            await this.generate(prompt);

        const json =
            extractJson<TrainingRecommendationAnalysis>(
                text,
            );

        return {
            learningPathId:
                json.learningPathId,

            learningPathTitle:
                json.learningPathTitle,

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


        console.log("\n================ CANDIDATE FOR AI EVALUATION ================");
        console.dir(candidate, { depth: null });
        console.log("=============================================================\n");


        const prompt =
            buildFullEvaluationPrompt(
                candidate,
            );

        const text = await this.generate(prompt);

        const json =
            extractJson<FullEvaluationAnalysis>(
                text,
            );

        
        return json;
    }

}