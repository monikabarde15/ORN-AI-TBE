import { useEffect, useState, useCallback } from "react";
import { useRoute } from "wouter";
import api from "../../../services/api";
import { Shell } from "@/components/layout/Shell";
import CourseSidebar from "./components/CourseSidebar";
import ContentArea from "./components/ContentArea";

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

  // State
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);
  const [currentLecture, setCurrentLecture] = useState<Lesson | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [contentMode, setContentMode] = useState<ContentMode>("about");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Course Data
  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/api/courses/${courseId}`);
      const courseData = res.data?.data;

      if (!courseData) {
        throw new Error("Course not found");
      }

      setCourse(courseData);
      fetchRelatedCourses(courseData.id);

      // Format sections with proper state
      const formattedSections: Section[] = courseData?.sections?.map(
        (section: any) => ({
          id: section.id || section._id,
          title: section.sectionName || section.title,
          lessons: section.lessons?.map((lesson: any) => ({
            id: lesson.id || lesson._id,
            title: lesson.title,
            description: lesson.description,
            duration: lesson.timeDuration || lesson.duration,
            videoUrl: lesson.videoUrl,
            pdfUrl: lesson.pdfUrl,
            completed: lesson.completed || false,
            quizCompleted: lesson.quizCompleted || false,
            quizzes: lesson.quizzes?.map((quiz: any) => ({
              id: quiz.id || quiz._id,
              question: quiz.question,
              options: Array.isArray(quiz.options)
                ? quiz.options
                : JSON.parse(quiz.options || "[]"),
              correctAnswer: quiz.correctAnswer,
            })) || [],
          })) || [],
        })
      ) || [];

      setSections(formattedSections);

      // Auto-expand first section
      if (formattedSections.length > 0) {
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
      const filtered = courses.filter((c: any) => c._id !== currentCourseId);
      setRelatedCourses(filtered.slice(0, 3));
    } catch (err) {
      console.error("Related courses error:", err);
    }
  };

  // Handlers
  const handleLessonSelect = useCallback((lesson: Lesson) => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        lessons: section.lessons.map((item) =>
          item.id === lesson.id
            ? { ...item, completed: true }
            : item
        ),
      }))
    );

    setCurrentLecture({ ...lesson, completed: true });
    setContentMode("lesson");
  }, []);

  const handleQuizSelect = useCallback((lesson: Lesson) => {
    setCurrentLecture(lesson);
    setContentMode("quiz");
  }, []);

  const handleQuizCompleted = useCallback((lessonId: string) => {
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

    // Stay on quiz page - user clicks "Continue" to go back
  }, []);

  const handleAboutSelect = useCallback(() => {
    setContentMode("about");
  }, []);

  const handleFinalAssessment = useCallback(() => {
    setContentMode("finalAssessment");
  }, []);

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
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
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
          onQuizCompleted={handleQuizCompleted}
        />
      </div>
    </Shell>
  );
};

export default CoursePlayer;