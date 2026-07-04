// artifacts\api-server\src\lib\ai\prompts\training-recommendation.prompt.ts
import "dotenv/config";

import { generateTrainingRecommendation } from "../ai-services/training-recommendation.service";

async function main() {
  try {
    const result = await generateTrainingRecommendation({
      id: "candidate-001",

      fullName: "John Doe",

      targetRole: "Frontend Developer",

      country: "India",

      evaluation: {
        scores: {
          overall: 72,
          englishReadiness: 68,
          technicalSkillMatch: 63,
          europeJobReadiness: 59,
          upskillingNeeds: 48,
        },
      },
    });

    console.log("\n===== AI Training Recommendation =====\n");

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\n===== ERROR =====\n");
    console.error(error);
  }
}

main();