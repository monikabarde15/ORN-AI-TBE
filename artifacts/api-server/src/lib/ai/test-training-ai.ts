import "dotenv/config";

// import { recommendTrainingWithAI } from "../training-ai";

// async function main() {
//   const result =
//     await recommendTrainingWithAI({
//       id: "candidate-001",

//       targetRole: "Frontend Developer",

//       evaluation: {
//         scores: {
//           overall: 72,
//           englishReadiness: 68,
//           technicalSkillMatch: 63,
//           europeJobReadiness: 59,
//           upskillingNeeds: 48,
//         },
//       },
//     });

//   console.log(
//     JSON.stringify(result, null, 2),
//   );
// }

// main();


import { recommendTraining } from "../training";
import { recommendTrainingWithAI } from "../training-ai";

async function main() {
  const candidate = {
    id: "candidate-001",

    targetRole: "Frontend Developer",

    evaluation: {
      scores: {
        overall: 72,
        englishReadiness: 68,
        technicalSkillMatch: 63,
        europeJobReadiness: 59,
        upskillingNeeds: 48,
      },
    },
  };

  const legacy = recommendTraining(candidate);

  const ai = await recommendTrainingWithAI(candidate);

  console.log("========== LEGACY ==========");
  console.log(JSON.stringify(legacy, null, 2));

  console.log("========== AI ==========");
  console.log(JSON.stringify(ai, null, 2));
}

main();