import { useEffect, useState, useCallback } from "react";
import { useRoute } from "wouter";
import api from "../../../services/api";
import { Shell } from "@/components/layout/Shell";
import CourseSidebar from "./components/CourseSidebar";
import ContentArea from "./components/ContentArea";
import { useSidebar } from "./components/sidebar/useSidebar";
import { useAuth } from "@/hooks/use-auth";
import {
  loadCourseProgress,
  syncProgressWithServer,
  markLessonCompletedStorage,
  markQuizCompletedStorage,
  saveLastActiveStorage,
} from "./utils/progressStorage";

export type ContentMode = "about" | "lesson" | "quiz" | "finalAssessment";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  videoUrl?: string;
  pdfUrl?: string;
  completed: boolean;
  quizCompleted: boolean;
  quizzes: Quiz[];
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  courseName: string;
  description?: string;
  sections: Section[];
}

const CoursePlayer = () => {
  const [, params] = useRoute("/course/details/:id");
  const courseId = params?.id;
  const { user } = useAuth();

  // State
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);
  const [currentLecture, setCurrentLecture] = useState<Lesson | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [contentMode, setContentMode] = useState<ContentMode>("about");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");

  // For collapsable behaviour
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebar();

  useEffect(() => {
    localStorage.setItem(
      "course-sidebar-collapsed",
      JSON.stringify(sidebarCollapsed)
    );
  }, [sidebarCollapsed]);

  // Fetch Course Data & Restore Saved Progress
  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, user?.id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      setCategoryName("");

      const res = await api.get(`/api/courses/${courseId}`);
      const courseData = res.data?.data;

      if (!courseData) {
        throw new Error("Course not found");
      }

      setCourse(courseData);

      if (courseData.category) {
        fetchCategory(courseData.category);
      } else {
        setCategoryName("");
      }
      fetchRelatedCourses(courseData.id);

      // Load persistent progress from Server API & localStorage
      const savedProgress = await syncProgressWithServer(user?.id, courseData.id);

      // Format sections with saved completion state
      const formattedSections: Section[] = courseData?.sections?.map(
        (section: any) => ({
          id: section.id || section._id,
          title: section.sectionName || section.title,
          lessons: section.lessons?.map((lesson: any) => {
            const lessonId = lesson.id || lesson._id;
            const isCompleted =
              !!savedProgress.completedLessons[lessonId] || !!lesson.completed;
            const isQuizCompleted =
              !!savedProgress.completedQuizzes[lessonId] || !!lesson.quizCompleted;

            return {
              id: lessonId,
              title: lesson.title,
              description: lesson.description,
              duration: lesson.timeDuration || lesson.duration,
              videoUrl: lesson.videoUrl,
              pdfUrl: lesson.pdfUrl,
              completed: isCompleted,
              quizCompleted: isQuizCompleted,
              quizzes: lesson.quizzes?.map((quiz: any) => ({
                id: quiz.id || quiz._id,
                question: quiz.question,
                options: Array.isArray(quiz.options)
                  ? quiz.options
                  : JSON.parse(quiz.options || "[]"),
                correctAnswer: quiz.correctAnswer,
              })) || [],
            };
          }) || [],
        })
      ) || [];

      setSections(formattedSections);

      // Find all lessons array
      const allLessons = formattedSections.flatMap((s) => s.lessons);

      // Determine active lecture to auto-resume:
      // If last active lesson was completed, move to the NEXT uncompleted lesson
      let activeLesson: Lesson | null = null;

      if (savedProgress.lastActiveLessonId) {
        const lastLesson = allLessons.find((l) => l.id === savedProgress.lastActiveLessonId);
        if (lastLesson) {
          if (lastLesson.completed) {
            // Find next uncompleted lesson after last active
            const lastIdx = allLessons.findIndex((l) => l.id === lastLesson.id);
            const nextUncompleted = allLessons.slice(lastIdx + 1).find((l) => !l.completed);
            activeLesson = nextUncompleted || allLessons.find((l) => !l.completed) || lastLesson;
          } else {
            activeLesson = lastLesson;
          }
        }
      }

      if (!activeLesson && allLessons.length > 0) {
        // Find first incomplete lesson or default to first
        activeLesson = allLessons.find((l) => !l.completed) || allLessons[0];
      }

      if (activeLesson) {
        setCurrentLecture(activeLesson);
        // Force lesson video player mode if watching lessons
        const modeToSet =
          savedProgress.lastContentMode && savedProgress.lastContentMode !== "about"
            ? savedProgress.lastContentMode
            : "lesson";
        setContentMode(modeToSet);

        // Expand parent section of active lesson
        const parentSec = formattedSections.find((s) =>
          s.lessons.some((l) => l.id === activeLesson?.id)
        );
        if (parentSec) {
          setExpandedSections([parentSec.id]);
        }
      } else if (formattedSections.length > 0) {
        setExpandedSections([formattedSections[0].id]);
      }
    } catch (err) {
      console.error("Course fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedCourses = async (currentCourseId: string) => {
    try {
      const res = await api.get("/api/courses");
      const courses = res.data || [];

      const coursesWithCategory = await Promise.all(
        courses.map(async (course: any) => {
          try {
            if (course.category) {
              const catRes = await api.get(
                `/api/course-category/${course.category}`
              );

              return {
                ...course,
                categoryName: catRes.data?.data?.name || "",
              };
            }

            return course;
          } catch {
            return course;
          }
        })
      );

      const filtered = coursesWithCategory.filter(
        (c: any) => c.id !== currentCourseId
      );

      setRelatedCourses(filtered.slice(0, 3));
    } catch (err) {
      console.error("Related courses error:", err);
    }
  };

  // Handlers
  const handleLessonSelect = useCallback(
    (lesson: Lesson) => {
      setCurrentLecture(lesson);
      setContentMode("lesson");
      if (courseId) {
        saveLastActiveStorage(user?.id, courseId, lesson.id, "lesson");
      }
    },
    [courseId, user?.id]
  );

  const handleLessonCompleted = useCallback(
    (lessonId: string) => {
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          lessons: section.lessons.map((item) =>
            item.id === lessonId ? { ...item, completed: true } : item
          ),
        }))
      );

      setCurrentLecture((prev) =>
        prev && prev.id === lessonId ? { ...prev, completed: true } : prev
      );

      if (courseId) {
        markLessonCompletedStorage(user?.id, courseId, lessonId);
      }
    },
    [courseId, user?.id]
  );

  const handleQuizSelect = useCallback(
    (lesson: Lesson) => {
      setCurrentLecture(lesson);
      setContentMode("quiz");
      if (courseId) {
        saveLastActiveStorage(user?.id, courseId, lesson.id, "quiz");
      }
    },
    [courseId, user?.id]
  );

  const handleQuizCompleted = useCallback(
    (lessonId: string) => {
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          lessons: section.lessons.map((item) =>
            item.id === lessonId
              ? { ...item, quizCompleted: true, completed: true }
              : item
          ),
        }))
      );

      setCurrentLecture((prev) =>
        prev && prev.id === lessonId
          ? { ...prev, quizCompleted: true, completed: true }
          : prev
      );

      if (courseId) {
        markQuizCompletedStorage(user?.id, courseId, lessonId);
      }
    },
    [courseId, user?.id]
  );

  const handleAboutSelect = useCallback(() => {
    setContentMode("about");
  }, []);

  const handleFinalAssessment = useCallback(() => {
    setContentMode("finalAssessment");
    if (courseId && currentLecture) {
      saveLastActiveStorage(user?.id, courseId, currentLecture.id, "finalAssessment");
    }
  }, [courseId, currentLecture, user?.id]);

  const videoLessons = sections
    .flatMap((section) => section.lessons)
    .filter((lesson) => lesson.videoUrl);

  const currentLessonIndex =
    videoLessons.findIndex(
      (lesson) =>
        lesson.id === currentLecture?.id
    );

  const handleNextLesson =
    useCallback(() => {
      const nextLesson =
        videoLessons[
        currentLessonIndex + 1
        ];

      if (nextLesson) {

        const parentSection =
          sections.find((section) =>
            section.lessons.some(
              (lesson) =>
                lesson.id === nextLesson.id
            )
          );

        if (parentSection) {
          setExpandedSections([
            parentSection.id
          ]);
        }

        handleLessonSelect(
          nextLesson
        );
      }
    }, [
      videoLessons,
      currentLessonIndex,
      handleLessonSelect,
    ]);

  const handlePreviousLesson =
    useCallback(() => {
      const previousLesson =
        videoLessons[
        currentLessonIndex - 1
        ];

      if (previousLesson) {

        const parentSection =
          sections.find((section) =>
            section.lessons.some(
              (lesson) =>
                lesson.id === previousLesson.id
            )
          );

        if (parentSection) {
          setExpandedSections([
            parentSection.id
          ]);
        }

        handleLessonSelect(
          previousLesson
        );
      }
    }, [
      videoLessons,
      currentLessonIndex,
      handleLessonSelect,
    ]);
const fetchCategory = async (categoryId: string) => {
  console.log("courseData", course);
  try {
    const res = await api.get(`/api/course-category/${categoryId}`);

    if (res.data?.success) {
      setCategoryName(res.data.data.name);
    }
    console.log("Category API:", res.data);
  } catch (error) {
    console.error(error);
  }
};
  // Loading State
  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-screen bg-[#F8F8F8]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
      </Shell>
    );
  }

  // Error State
  if (error) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-screen bg-[#F8F8F8]">
          <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex h-screen bg-[#F8F8F8] ">
        {/* Sidebar */}
        <CourseSidebar
          course={course}
          sections={sections}
          currentLecture={currentLecture}
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          onLessonSelect={handleLessonSelect}
          onQuizSelect={handleQuizSelect}
          onAboutSelect={handleAboutSelect}
          onFinalAssessmentSelect={handleFinalAssessment}
        />

        {/* Content Area */}
        <ContentArea
          mode={contentMode}
          course={course}
          lecture={currentLecture}
          relatedCourses={relatedCourses}
           categoryName={categoryName}
          onQuizCompleted={handleQuizCompleted}
          onLessonCompleted={handleLessonCompleted}

          sections={sections}
          currentLecture={currentLecture}

          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}

          onLessonSelect={handleLessonSelect}
          onQuizSelect={handleQuizSelect}
          onFinalAssessmentSelect={handleFinalAssessment}
          onPreviousLesson={handlePreviousLesson}
          onNextLesson={handleNextLesson}
        />
      </div>
    </Shell>
  );
};

export default CoursePlayer;