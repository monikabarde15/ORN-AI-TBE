import "dotenv/config";

import { evaluateWithAI } from "../evaluation-full-ai";

async function main() {
  const result = await evaluateWithAI({
    id: "candidate-001",

    fullName: "John Doe",

    email: "john@gmail.com",

    englishLevel: "B2",

    visaStatus: "work_permit",

    yearsExperience: 4,

    euWorkEligible: true,

    targetRole: "Frontend Developer",

    country: "India",

    careerGapMonths: 0,

    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
    ],

    cv: {
      fileName: "resume.pdf",

      contentSummary:
        "Frontend Developer with 4 years of React and Next.js experience.",
    },
  });

  console.log(
    JSON.stringify(result, null, 2),
  );
}

main().catch(console.error);