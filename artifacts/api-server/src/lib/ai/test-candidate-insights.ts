import "dotenv/config";

import { generateCandidateInsights } from "../ai-services/candidate-insights.service";

async function main() {
  try {
    const result = await generateCandidateInsights({
      id: "candidate-001",

      fullName: "John Doe",

      email: "john@gmail.com",

      englishLevel: "B2",

      visaStatus: "requires_sponsorship",

      yearsExperience: 3,

      euWorkEligible: false,

      targetRole: "Frontend Developer",

      country: "India",

      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
      ],

      cv: {
        fileName: "john-doe.pdf",
        contentSummary:
          "Frontend developer with 3 years of React and Next.js experience.",
      },

      careerGapMonths: 0,
    });

    console.log("\n===== AI Candidate Insights =====\n");

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\n===== ERROR =====\n");
    console.error(error);
  }
}

main();