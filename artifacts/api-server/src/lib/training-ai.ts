import { db, learningPathsTable, coursesTable } from "@workspace/db";

import { eq } from "drizzle-orm";

import type { RecommendationResult } from "./training";

import { generateTrainingRecommendation } from "./ai-services/training-recommendation.service";

interface MinCandidate {
  id: string;
  targetRole: string;
  evaluation: unknown;
}

async function getEnabledLearningPaths() {
  const learningPaths = await db
    .select()
    .from(learningPathsTable)
    .where(eq(learningPathsTable.isEnabled, true));

  const allCourses = await db
    .select()
    .from(coursesTable);

  return learningPaths.map((path) => ({
    id: path.id,
    title: path.title,
    description: path.description,
    courses: allCourses
      .filter((course) =>
        path.courseIds?.includes(course.id),
      )
      .map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
      })),
  }));
}

export async function recommendTrainingWithAI(
  candidate: MinCandidate,
): Promise<RecommendationResult> {
  const learningPaths =
    await getEnabledLearningPaths();

  return generateTrainingRecommendation(
    candidate,
    learningPaths,
  );
}