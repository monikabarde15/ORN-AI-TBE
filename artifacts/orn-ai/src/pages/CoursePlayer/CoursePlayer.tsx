import { useEffect, useState } from "react";
import { useRoute } from "wouter";

import api from "../../../services/api";
import { Shell } from "@/components/layout/Shell";

import CourseSidebar from "./components/CourseSidebar";
import ContentArea from "./components/ContentArea";

export type ContentMode =
  | "about"
  | "lesson"
  | "quiz"
    | "finalAssessment";

const CoursePlayer = () => {
  const [, params] =
    useRoute("/course/details/:id");
const [relatedCourses, setRelatedCourses] =
  useState<any[]>([]);
  const courseId = params?.id;
console.log("params", params);
console.log("courseId", params?.id);
  const [course, setCourse] =
    useState<any>(null);

  const [sections, setSections] =
    useState<any[]>([]);

  const [currentLecture,
    setCurrentLecture] =
    useState<any>(null);

  const [expandedSections,
    setExpandedSections] =
    useState<string[]>([]);

  const [sidebarOpen,
    setSidebarOpen] =
    useState(false);

  const [contentMode,
    setContentMode] =
    useState<ContentMode>("about");

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
  try {
    const res = await api.get(
      `/api/courses/${courseId}`
    );

    const courseData =
      res.data?.data;

    setCourse(courseData);

    // ADD THIS
    fetchRelatedCourses(
      courseData.id
    );

    const formattedSections =
  courseData?.sections?.map(
    (section: any) => ({
      id: section.id,
      title: section.sectionName,

      lessons:
        section.lessons?.map(
          (lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            duration: lesson.timeDuration,
            videoUrl: lesson.videoUrl,
            pdfUrl: lesson.pdfUrl,

            quizzes:
              lesson.quizzes?.map(
                (quiz: any) => ({
                  ...quiz,
                  options: Array.isArray(
                    quiz.options
                  )
                    ? quiz.options
                    : JSON.parse(
                        quiz.options || "[]"
                      ),
                })
              ) || [],
          })
        ) || [],
    })
  ) || [];

    setSections(
      formattedSections
    );

  } catch (error) {
    console.error(
      "Course fetch error",
      error
    );
  }
};

const handleLectureSelect = (
  lecture: any
) => {
  setSections((prev) =>
    prev.map((section) => ({
      ...section,
      lessons: section.lessons.map(
        (item: any) =>
          item.id === lecture.id
            ? {
                ...item,
                completed: true,
              }
            : item
      ),
    }))
  );

  setCurrentLecture({
    ...lecture,
    completed: true,
  });

  setContentMode("lesson");
  console.log(sections);
};

  const handleQuizSelect = (
    lecture: any
  ) => {
    setCurrentLecture(
      lecture
    );

    setContentMode("quiz");
  };

  const handleAboutSelect =
    () => {
      setContentMode(
        "about"
      );
    };
const fetchRelatedCourses = async (
  currentCourseId: string
) => {
  try {
    const res = await api.get(
      "/api/courses"
    );

    const courses =
      res.data || [];

    const filteredCourses =
      courses.filter(
        (course: any) =>
          course._id !== currentCourseId
      );

    setRelatedCourses(
      filteredCourses
    );

    console.log(
      "Related Courses",
      filteredCourses
    );
    
  } catch (error) {
    console.error(
      "Related courses error",
      error
    );
  }
};
const handleFinalAssessment =
  () => {
    setContentMode(
      "finalAssessment"
    );
  };
  const handleQuizCompleted = () => {
  setContentMode(
    "finalAssessment"
  );
};
  return (
    <Shell>
      <div className="flex h-screen bg-[#F8F8F8] overflow-hidden">

        <CourseSidebar
          course={course}
          sections={sections}
          currentLecture={
            currentLecture
          }
          expandedSections={
            expandedSections
          }
          setExpandedSections={
            setExpandedSections
          }
          sidebarOpen={
            sidebarOpen
          }
          setSidebarOpen={
            setSidebarOpen
          }
          onLessonSelect={
            handleLectureSelect
          }
          onQuizSelect={
            handleQuizSelect
          }
          onAboutSelect={
            handleAboutSelect
          }
          onFinalAssessmentSelect={
    handleFinalAssessment
  }

        />

        <ContentArea
          mode={contentMode}
          course={course}
          lecture={
            currentLecture
          }
           relatedCourses={relatedCourses}
           onQuizCompleted={
              handleQuizCompleted
            }
        />
      </div>
    </Shell>
  );
};

export default CoursePlayer;