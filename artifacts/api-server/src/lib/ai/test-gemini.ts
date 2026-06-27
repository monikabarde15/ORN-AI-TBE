import "dotenv/config";
import { analyzeResume } from "../ai-services/resume-analysis.service";

async function main() {
  const resume = `
John Doe

Frontend Engineer

Email: john@gmail.com

Phone: +91 9876543210

Experience:
3 years working with React, Next.js and TypeScript.

Skills:
React
Next.js
TypeScript
Tailwind CSS
Node.js

Location:
India
`;

  try {
    const result = await analyzeResume(resume);

    console.log(
      JSON.stringify(result, null, 2),
    );
  } catch (err) {
    console.error(err);
  }
}

main();