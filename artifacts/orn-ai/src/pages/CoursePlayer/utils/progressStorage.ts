import api from "../../../../services/api";

export interface CourseProgressData {
  completedLessons: Record<string, boolean>;
  completedQuizzes: Record<string, boolean>;
  lastActiveLessonId?: string;
  lastContentMode?: "about" | "lesson" | "quiz" | "finalAssessment";
  lessonPositions: Record<string, number>;
  finalAssessment?: {
    completed: boolean;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    date: string;
    answers: Record<number, number>;
  };
}

export const getCourseStorageKeys = (
  userId: string | undefined | null,
  courseId: string
): string[] => {
  const keys: string[] = [];
  if (userId) {
    keys.push(`orn_course_progress_user_${userId}_${courseId}`);
  }
  keys.push(`orn_course_progress_user_guest_${courseId}`);
  keys.push(`orn_course_progress_general_${courseId}`);
  return keys;
};

export const loadCourseProgress = (
  userId: string | undefined | null,
  courseId: string
): CourseProgressData => {
  const merged: CourseProgressData = {
    completedLessons: {},
    completedQuizzes: {},
    lessonPositions: {},
  };

  try {
    const keys = getCourseStorageKeys(userId, courseId);
    for (const key of keys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          merged.completedLessons = {
            ...merged.completedLessons,
            ...(parsed.completedLessons || {}),
          };
          merged.completedQuizzes = {
            ...merged.completedQuizzes,
            ...(parsed.completedQuizzes || {}),
          };
          merged.lessonPositions = {
            ...merged.lessonPositions,
            ...(parsed.lessonPositions || {}),
          };
          if (parsed.lastActiveLessonId) {
            merged.lastActiveLessonId = parsed.lastActiveLessonId;
          }
          if (parsed.lastContentMode) {
            merged.lastContentMode = parsed.lastContentMode;
          }
          if (parsed.finalAssessment) {
            merged.finalAssessment = parsed.finalAssessment;
          }
        } catch {
          // continue
        }
      }
    }
  } catch (error) {
    console.error("Failed to load course progress from localStorage", error);
  }

  return merged;
};

export const syncProgressWithServer = async (
  userId: string | undefined | null,
  courseId: string
): Promise<CourseProgressData> => {
  const localData = loadCourseProgress(userId, courseId);
  try {
    const res = await api.get(`/api/courses/${courseId}/progress`);
    if (res.data?.success && res.data?.data) {
      const serverData = res.data.data;
      const merged: CourseProgressData = {
        ...localData,
        ...serverData,
        completedLessons: {
          ...localData.completedLessons,
          ...(serverData.completedLessons || {}),
        },
        completedQuizzes: {
          ...localData.completedQuizzes,
          ...(serverData.completedQuizzes || {}),
        },
        lessonPositions: {
          ...localData.lessonPositions,
          ...(serverData.lessonPositions || {}),
        },
        finalAssessment: serverData.finalAssessment || localData.finalAssessment,
      };

      // Save merged to keys
      const keys = getCourseStorageKeys(userId, courseId);
      keys.forEach((key) => {
        localStorage.setItem(key, JSON.stringify(merged));
      });
      return merged;
    }
  } catch (err) {
    console.warn("Backend progress fetch fallback to localStorage:", err);
  }
  return localData;
};

export const saveCourseProgress = (
  userId: string | undefined | null,
  courseId: string,
  data: Partial<CourseProgressData>
): CourseProgressData => {
  try {
    const existing = loadCourseProgress(userId, courseId);
    const updated: CourseProgressData = {
      ...existing,
      ...data,
      completedLessons: {
        ...existing.completedLessons,
        ...(data.completedLessons || {}),
      },
      completedQuizzes: {
        ...existing.completedQuizzes,
        ...(data.completedQuizzes || {}),
      },
      lessonPositions: {
        ...existing.lessonPositions,
        ...(data.lessonPositions || {}),
      },
      finalAssessment: data.finalAssessment || existing.finalAssessment,
    };

    const keys = getCourseStorageKeys(userId, courseId);
    keys.forEach((key) => {
      localStorage.setItem(key, JSON.stringify(updated));
    });

    // Async sync to Backend API Database
    api.post(`/api/courses/${courseId}/progress`, updated).catch((err) => {
      console.warn("API progress sync notice:", err);
    });

    return updated;
  } catch (error) {
    console.error("Failed to save course progress to localStorage", error);
    return loadCourseProgress(userId, courseId);
  }
};

export const markLessonCompletedStorage = (
  userId: string | undefined | null,
  courseId: string,
  lessonId: string
): CourseProgressData => {
  const existing = loadCourseProgress(userId, courseId);
  existing.completedLessons[lessonId] = true;
  return saveCourseProgress(userId, courseId, existing);
};

export const markQuizCompletedStorage = (
  userId: string | undefined | null,
  courseId: string,
  lessonId: string
): CourseProgressData => {
  const existing = loadCourseProgress(userId, courseId);
  existing.completedQuizzes[lessonId] = true;
  existing.completedLessons[lessonId] = true;
  return saveCourseProgress(userId, courseId, existing);
};

export const saveLessonPositionStorage = (
  userId: string | undefined | null,
  courseId: string,
  lessonId: string,
  seconds: number
) => {
  const existing = loadCourseProgress(userId, courseId);
  existing.lessonPositions[lessonId] = seconds;
  saveCourseProgress(userId, courseId, existing);
};

export const saveLastActiveStorage = (
  userId: string | undefined | null,
  courseId: string,
  lessonId: string,
  mode: "about" | "lesson" | "quiz" | "finalAssessment"
) => {
  const existing = loadCourseProgress(userId, courseId);
  existing.lastActiveLessonId = lessonId;
  existing.lastContentMode = mode;
  saveCourseProgress(userId, courseId, existing);
};

export const saveFinalAssessmentStorage = (
  userId: string | undefined | null,
  courseId: string,
  assessmentData: NonNullable<CourseProgressData["finalAssessment"]>
) => {
  const existing = loadCourseProgress(userId, courseId);
  existing.finalAssessment = assessmentData;
  saveCourseProgress(userId, courseId, existing);
};
