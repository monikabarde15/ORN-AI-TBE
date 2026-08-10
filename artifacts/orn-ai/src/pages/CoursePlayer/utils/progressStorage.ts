import api from "../../../../services/api";

export interface CourseProgressData {
  completedLessons: Record<string, boolean>;
  completedQuizzes: Record<string, boolean>;
  lastActiveLessonId?: string;
  lastContentMode?: "about" | "lesson" | "quiz" | "finalAssessment";
  lessonPositions: Record<string, number>;
  lessonScores?: Record<string, number>;
  quizScores?: Record<string, number>;
  totalScore?: number;
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

// In-Memory Redis-style fast client cache
const memoryCache = new Map<string, CourseProgressData>();

// Pending sync debouncer to prevent backend/db crash during rapid video updates
const syncDebounceTimers = new Map<string, NodeJS.Timeout>();
const pendingUpdates = new Map<string, Partial<CourseProgressData>>();

const getPrimaryStorageKey = (
  userId: string | undefined | null,
  courseId: string
): string => {
  if (userId) {
    return `orn_course_progress_user_${userId}_${courseId}`;
  }
  return `orn_course_progress_general_${courseId}`;
};

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
  const primaryKey = getPrimaryStorageKey(userId, courseId);

  if (memoryCache.has(primaryKey)) {
    return memoryCache.get(primaryKey)!;
  }

  const merged: CourseProgressData = {
    completedLessons: {},
    completedQuizzes: {},
    lessonPositions: {},
    lessonScores: {},
    quizScores: {},
    totalScore: 0,
  };

  try {
    const keys = getCourseStorageKeys(userId, courseId);
    for (const key of keys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          merged.completedLessons = { ...merged.completedLessons, ...(parsed.completedLessons || {}) };
          merged.completedQuizzes = { ...merged.completedQuizzes, ...(parsed.completedQuizzes || {}) };
          merged.lessonPositions = { ...merged.lessonPositions, ...(parsed.lessonPositions || {}) };
          merged.lessonScores = { ...merged.lessonScores, ...(parsed.lessonScores || {}) };
          merged.quizScores = { ...merged.quizScores, ...(parsed.quizScores || {}) };
          if (typeof parsed.totalScore === "number") {
            merged.totalScore = Math.max(merged.totalScore || 0, parsed.totalScore);
          }
          if (parsed.lastActiveLessonId) merged.lastActiveLessonId = parsed.lastActiveLessonId;
          if (parsed.lastContentMode) merged.lastContentMode = parsed.lastContentMode;
          if (parsed.finalAssessment) merged.finalAssessment = parsed.finalAssessment;
        } catch {
          // Ignore
        }
      }
    }
  } catch (error) {
    console.error("Failed to load course progress from localStorage:", error);
  }

  memoryCache.set(primaryKey, merged);
  return merged;
};

export const syncProgressWithServer = async (
  userId: string | undefined | null,
  courseId: string
): Promise<CourseProgressData> => {
  try {
    const res = await api.get(`/api/courses/${courseId}/progress`);
    if (res.data?.success && res.data?.data) {
      const serverData = res.data.data;
      
      // ✅ MEMORY CACHE OVERWRITE (Backend data se replace)
      const primaryKey = getPrimaryStorageKey(userId, courseId);
      memoryCache.set(primaryKey, serverData);

      // ✅ LOCAL STORAGE OVERWRITE
      const keys = getCourseStorageKeys(userId, courseId);
      keys.forEach((key) => {
        try {
          localStorage.setItem(key, JSON.stringify(serverData));
        } catch { }
      });

      console.log("✅ Backend se data fetch kar liya. Local cache update ho gayi.");
      return serverData;
    }
  } catch (err) {
    console.warn("⚠️ Backend down hai. LocalStorage ka purana data use ho raha hai.");
  }

  // Agar Backend fail ho, tab hi localStorage use karo
  return loadCourseProgress(userId, courseId);
};

// Internal function to sync data to Backend Database
const flushServerSync = async (courseId: string, data: CourseProgressData) => {
  try {
    await api.post(`/api/courses/${courseId}/progress`, data);
    console.log("✅ Progress successfully saved to Backend!");
  } catch (err) {
    console.error("❌ FATAL ERROR: Data NOT saved to Backend!", err);
  }
};

// export const saveCourseProgress = (
//   userId: string | undefined | null,
//   courseId: string,
//   data: Partial<CourseProgressData>,
//   immediate = false
// ): void => {
//   const primaryKey = getPrimaryStorageKey(userId, courseId);
//   const existing = memoryCache.get(primaryKey) || {
//     completedLessons: {},
//     completedQuizzes: {},
//     lessonPositions: {},
//     lessonScores: {},
//     quizScores: {},
//     totalScore: 0,
//   };

//    const updatedLessonScores = { ...(existing.lessonScores || {}), ...(data.lessonScores || {}) };
//   const lessonScoreSum = Object.values(updatedLessonScores).reduce((a, b) => a + (Number(b) || 0), 0);

//   // ✅ Step 2: Quizzes aur Assessment abhi 0 hi rahenge (Feature ready hone par uncomment karna)
//   // const updatedQuizScores = { ...(existing.quizScores || {}), ...(data.quizScores || {}) };
//   // const quizScoreSum = Object.values(updatedQuizScores).reduce((a, b) => a + (Number(b) || 0), 0);
//   // const assessmentScore = data.finalAssessment?.score ?? existing.finalAssessment?.score ?? 0;
  
//   const quizScoreSum = 0; // Abhi ke liye 0
//   const assessmentScore = 0; // Abhi ke liye 0

//   // ✅ Step 3: Total Score calculate karo (Sirf Lessons sum)
//   const computedTotalScore = lessonScoreSum + quizScoreSum + assessmentScore;

//   const updated: CourseProgressData = {
//     ...existing,
//     ...data,
//     completedLessons: { ...existing.completedLessons, ...(data.completedLessons || {}) },
//     completedQuizzes: { ...existing.completedQuizzes, ...(data.completedQuizzes || {}) },
//     lessonPositions: { ...existing.lessonPositions, ...(data.lessonPositions || {}) },
//     lessonScores: updatedLessonScores,
//     quizScores: updatedQuizScores,
//     totalScore: computedTotalScore,
//     finalAssessment: data.finalAssessment || existing.finalAssessment,
//   };

//   memoryCache.set(primaryKey, updated);

//     console.log("🚀 [FRONTEND] Sending to Backend. Course ID:", courseId);
//     console.log("🚀 [FRONTEND] Payload:", JSON.stringify(updated, null, 2));
//     console.log("🚀 [FRONTEND] Total Score being sent:", updated.totalScore);
//   // Ye line localStorage mein save karega (Backend fail hone par bhi data safe rahega)
//   const keys = getCourseStorageKeys(userId, courseId);
//   keys.forEach((key) => {
//     try {
//       localStorage.setItem(key, JSON.stringify(updated));
//     } catch { }
//   });

//   if (immediate) {
//     if (syncDebounceTimers.has(courseId)) {
//       clearTimeout(syncDebounceTimers.get(courseId)!);
//       syncDebounceTimers.delete(courseId);
//     }
//     flushServerSync(courseId, updated);
//   } else {
//     pendingUpdates.set(courseId, updated);
//     if (syncDebounceTimers.has(courseId)) {
//       clearTimeout(syncDebounceTimers.get(courseId)!);
//     }
//     const timer = setTimeout(() => {
//       syncDebounceTimers.delete(courseId);
//       const pending = pendingUpdates.get(courseId) as CourseProgressData;
//       if (pending) {
//         pendingUpdates.delete(courseId);
//         flushServerSync(courseId, pending);
//       }
//     }, 3000);
//     syncDebounceTimers.set(courseId, timer);
//   }
// };
export const saveCourseProgress = (
  userId: string | undefined | null,
  courseId: string,
  data: Partial<CourseProgressData>,
  immediate = false
): void => {
  const primaryKey = getPrimaryStorageKey(userId, courseId);
  const existing = memoryCache.get(primaryKey) || {
    completedLessons: {},
    completedQuizzes: {},
    lessonPositions: {},
    lessonScores: {},
    quizScores: {},
    totalScore: 0,
  };

  // ✅ 1. Ensure lessonScores is updated from data
  const updatedLessonScores = { ...(existing.lessonScores || {}), ...(data.lessonScores || {}) };
  const lessonScoreSum = Object.values(updatedLessonScores).reduce((a, b) => a + (Number(b) || 0), 0);

  // ✅ 2. Quizzes aur Assessment abhi 0 rahenge
  const quizScoreSum = 0;
  const assessmentScore = 0;

  // ✅ 3. Total Score = Sirf Lessons ka sum
  const computedTotalScore = lessonScoreSum + quizScoreSum + assessmentScore;

  const updated: CourseProgressData = {
    ...existing,
    ...data,
    completedLessons: { ...existing.completedLessons, ...(data.completedLessons || {}) },
    completedQuizzes: { ...existing.completedQuizzes, ...(data.completedQuizzes || {}) },
    lessonPositions: { ...existing.lessonPositions, ...(data.lessonPositions || {}) },
    lessonScores: updatedLessonScores,
    quizScores: {}, 
    totalScore: computedTotalScore,
    finalAssessment: data.finalAssessment || existing.finalAssessment,
  };

  memoryCache.set(primaryKey, updated);

  // ============================================================
  // ✅ REAL PROGRESS % CALCULATION (100% Database-Based)
  // ============================================================
  // 1. Completed Lessons count karo (Cache + New Data merge karke)
  const completedLessonsCount = Object.values(updated.completedLessons).filter(val => val === true).length;

  // 2. Total Lessons count karo using Merged Data (Backend se fetch hua data)
  const totalLessonsInCourse = Object.keys(updated.completedLessons || {}).length;
  
  // 3. Exact Percentage calculate karo (Agar total 0 hai toh 0, warna (completed/total)*100)
  const realProgressPercent = totalLessonsInCourse > 0 
    ? Math.round((completedLessonsCount / totalLessonsInCourse) * 100) 
    : 0;

  // ============================================================
  // 🚀 FINAL CONSOLE LOGS (Aapko exact yeh dikhega)
  // ============================================================
  console.log("===============================================");
  console.log(`📊 [PROGRESS BAR %] Real-time Progress: ${realProgressPercent}%`);
  console.log(`📊 [SCORE] Total Score being sent: ${updated.totalScore}`);
  console.log(`📊 [LESSONS] Completed: ${completedLessonsCount} / ${totalLessonsInCourse}`);
  console.log("===============================================");

  // Ye line localStorage mein save karega
  const keys = getCourseStorageKeys(userId, courseId);
  keys.forEach((key) => {
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch { }
  });

  if (immediate) {
    if (syncDebounceTimers.has(courseId)) {
      clearTimeout(syncDebounceTimers.get(courseId)!);
      syncDebounceTimers.delete(courseId);
    }
    flushServerSync(courseId, updated);
  } else {
    pendingUpdates.set(courseId, updated);
    if (syncDebounceTimers.has(courseId)) {
      clearTimeout(syncDebounceTimers.get(courseId)!);
    }
    const timer = setTimeout(() => {
      syncDebounceTimers.delete(courseId);
      const pending = pendingUpdates.get(courseId) as CourseProgressData;
      if (pending) {
        pendingUpdates.delete(courseId);
        flushServerSync(courseId, pending);
      }
    }, 3000);
    syncDebounceTimers.set(courseId, timer);
  }
};
export const markLessonCompletedStorage = (
  userId: string | undefined | null,
  courseId: string,
  lessonId: string,
  score?: number
) => {
  const existing = memoryCache.get(getPrimaryStorageKey(userId, courseId)) || {
    completedLessons: {},
    completedQuizzes: {},
    lessonPositions: {},
    lessonScores: {},
    quizScores: {},
    totalScore: 0,
  };
  existing.completedLessons[lessonId] = true;
  if (score !== undefined) {
    existing.lessonScores = existing.lessonScores || {};
    existing.lessonScores[lessonId] = score;
  }
  saveCourseProgress(userId, courseId, existing, true);
};

export const markQuizCompletedStorage = (
  userId: string | undefined | null,
  courseId: string,
  lessonId: string,
  score?: number
) => {
  const existing = memoryCache.get(getPrimaryStorageKey(userId, courseId)) || {
    completedLessons: {},
    completedQuizzes: {},
    lessonPositions: {},
    lessonScores: {},
    quizScores: {},
    totalScore: 0,
  };
  existing.completedQuizzes[lessonId] = true;
  existing.completedLessons[lessonId] = true;
  if (score !== undefined) {
    existing.quizScores = existing.quizScores || {};
    existing.quizScores[lessonId] = score;
  }
  saveCourseProgress(userId, courseId, existing, true);
};
// ============================================================
// ✅ MISSING FUNCTION 1: saveLessonPositionStorage
// ============================================================
export const saveLessonPositionStorage = (
  userId: string | undefined | null,
  courseId: string,
  lessonId: string,
  seconds: number,
  score?: number
) => {
    console.log("📥 [saveLessonPositionStorage] Received Seconds:", seconds);
  console.log("📥 [saveLessonPositionStorage] Received Score:", score);
  const existing = memoryCache.get(getPrimaryStorageKey(userId, courseId)) || {
    completedLessons: {},
    completedQuizzes: {},
    lessonPositions: {},
    lessonScores: {},
    quizScores: {},
    totalScore: 0,
  };
  
  // Position update karo
  existing.lessonPositions[lessonId] = seconds;
  
  // Agar score bhi bheja hai, toh save karo
  if (score !== undefined) {
    existing.lessonScores = existing.lessonScores || {};
    existing.lessonScores[lessonId] = score;
  }
  
  // Backend ko sync karo
  saveCourseProgress(userId, courseId, existing, false);
};

// ============================================================
// ✅ MISSING FUNCTION 2: saveLessonScoreStorage (For future use)
// ============================================================
export const saveLessonScoreStorage = (
  userId: string | undefined | null,
  courseId: string,
  lessonId: string,
  score: number
) => {
  const existing = memoryCache.get(getPrimaryStorageKey(userId, courseId)) || {
    completedLessons: {},
    completedQuizzes: {},
    lessonPositions: {},
    lessonScores: {},
    quizScores: {},
    totalScore: 0,
  };
  
  existing.lessonScores = existing.lessonScores || {};
  existing.lessonScores[lessonId] = score;
  
  // Backend ko sync karo
  saveCourseProgress(userId, courseId, existing, false);
};
// Ensure pending debounced updates flush before page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    pendingUpdates.forEach((data, courseId) => {
      flushServerSync(courseId, data as CourseProgressData);
    });
  });
}