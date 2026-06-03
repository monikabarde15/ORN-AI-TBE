import { useEffect, useState } from "react";
import { useRoute } from "wouter";

import api from "../../../services/api";
import { Shell } from "@/components/layout/Shell";

import CourseSidebar from "./components/CourseSidebar";
import ContentArea from "./components/ContentArea";

export type ContentMode =
  | "about"
  | "lesson"
  | "quiz";

const CoursePlayer = () => {
  const [, params] =
    useRoute("/course/details/:id");

  const courseId = params?.id;

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

      const formattedSections =
        courseData?.sections?.map(
          (section: any) => ({
            id: section.id,
            title:
              section.sectionName,

            lessons:
              section.lessons?.map(
                (lesson: any) => ({
                  id: lesson.id,

                  title:
                    lesson.title,

                  description:
                    lesson.description,

                  duration:
                    lesson.timeDuration,

                  videoUrl:
                    lesson.videoUrl,

                  pdfUrl:
                    lesson.pdfUrl,

                  quizzes:
                    lesson.quizzes?.map(
                      (quiz: any) => ({
                        ...quiz,

                        options:
                          Array.isArray(
                            quiz.options
                          )
                            ? quiz.options
                            : JSON.parse(
                                quiz.options ||
                                  "[]"
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

      if (
        formattedSections.length >
        0
      ) {
        setExpandedSections([
          formattedSections[0].id,
        ]);
      }
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
    setCurrentLecture(
      lecture
    );

    setContentMode(
      "lesson"
    );
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
        />

        <ContentArea
          mode={contentMode}
          course={course}
          lecture={
            currentLecture
          }
        />
      </div>
    </Shell>
  );
};

export default CoursePlayer;