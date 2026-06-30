// artifacts\api-server\src\lib\ai\types.ts
import type { CandidateLike } from "../evaluation";

export interface ResumeAnalysis {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;

  lastRole: string | null;
  domain: string | null;

  skills: string[];

  // NEW
  employmentHistory: EmploymentHistory[];

  rawText: string;
}


export interface CandidateInsights {
  strengths: string[];
  gaps: string[];
  recommendedUpskilling: string[];

  recruiterSummary: string;

  placementRecommendation: string;
}

export interface TrainingRecommendationAnalysis {
  programId:
    | "prog_eu_workplace_english"
    | "prog_cloud_devops"
    | "prog_data_engineering"
    | "prog_ai_ml_bridge"
    | "prog_leadership"
    | "prog_eu_compliance";

  trainingType:
    | "upskilling"
    | "reskilling";

  assessmentCategory:
    | "needs_upskilling"
    | "needs_reskilling";

  rationale: string;

  confidence: number;
}

export interface FullEvaluationAnalysis {
  scores: {
    cvQuality: number;
    technicalSkillMatch: number;
    technicalRelevance: number;
    englishReadiness: number;
    europeJobReadiness: number;
    marketReadiness: number;
    careerGapRisk: number;
    upskillingNeeds: number;
    overall: number;
  };

  readinessTier:
    | "emerging"
    | "developing"
    | "ready"
    | "elite";

  classification:
    | "recruiter_ready"
    | "needs_upskilling"
    | "needs_reskilling"
    | "not_ready_yet";

  strengths: string[];

  gaps: string[];

  recommendedUpskilling: string[];

  insights: {
    title: string;
    detail: string;
    severity:
      | "strength"
      | "opportunity"
      | "gap";
  }[];
}

export interface EmploymentHistory {
  company?: string;
  role: string;
  startDate: string; // YYYY-MM
  endDate: string;   // YYYY-MM | Present
}



export interface AIProvider {
  analyzeResume(
    resumeText: string,
  ): Promise<ResumeAnalysis>;

  generateCandidateInsights(
    candidate: CandidateLike,
  ): Promise<CandidateInsights>;

  generateTrainingRecommendation(
    candidate: unknown,
  ): Promise<TrainingRecommendationAnalysis>;

  generateFullEvaluation(
    candidate: CandidateLike,
  ): Promise<FullEvaluationAnalysis>;
}




// export interface AIProvider {
//   analyzeResume(resumeText: string): Promise<ResumeAnalysis>;
// }

