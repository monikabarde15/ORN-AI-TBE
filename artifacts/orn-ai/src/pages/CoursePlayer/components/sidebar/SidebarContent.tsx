import { useCallback } from "react";
import {
  ArrowLeft,
  Lock,
  CheckCircle,
} from "lucide-react";
import { useLocation } from "wouter";

import ChapterAccordion from "../ChapterAccordion";
import ProgressBar from "../ProgressBar";

interface SidebarContentProps {
  course: any;
  sections?: any[];
  currentLecture: any;
  expandedSections: string[];
  setExpandedSections: React.Dispatch<
    React.SetStateAction<string[]>

  >;
  onLessonSelect: (lesson: any) => void;
  onQuizSelect: (lesson: any) => void;
  onAboutSelect: () => void;
  onFinalAssessmentSelect: () => void;
}

const SidebarContent = ({
  course,
  sections=[],
  currentLecture,
  expandedSections,
  setExpandedSections,
  onLessonSelect,
  onQuizSelect,
  onAboutSelect,
  onFinalAssessmentSelect,
}: SidebarContentProps) => {
  const [, setLocation] = useLocation();

  const calculateProgress = useCallback(() => {
    let totalItems = 0;
    let completedItems = 0;


    sections.forEach((section) => {
      section.lessons?.forEach((lesson: any) => {
        totalItems++;

        if (lesson.completed) {
          completedItems++;
        }

        if (lesson.quizzes?.length > 0) {
          totalItems++;

          if (lesson.quizCompleted) {
            completedItems++;
          }
        }
      });
    });

    return totalItems > 0
      ? Math.round(
        (completedItems / totalItems) * 100
      )
      : 0;


  }, [sections]);

  const progress = calculateProgress();

  const isAllCompleted =
    progress === 100 &&
    sections.length > 0;

  const handleBackToDashboard = () => {
    setLocation("/courses");
  };

  return (
    <>
      {/* HEADER */}
      <div
        className="
      border-b
      border-[#2A2A2A]
      px-5
      py-4
      lg:px-6
      lg:py-5
      flex-shrink-0
    "
      >
        <div
          className="
        flex
        items-center
        justify-between
        mb-4
      "
        >
          <button
            onClick={handleBackToDashboard}
            className="
          flex
          items-center
          gap-1.5
          text-sm
          text-gray-400
          hover:text-white
        "
          >
            <ArrowLeft
              size={16}
            />
            Back to Dashboard
          </button>
        </div>

        <button
          onClick={onAboutSelect}
          className="
        w-full
        text-left
      "
        >
          <h2
            className="
          text-xl
          lg:text-2xl
          font-bold
          text-white
          line-clamp-2
        "
          >
            {course?.courseName ||
              course?.title ||
              "Loading Course..."}
          </h2>
        </button>

        <div className="mt-4">
          <ProgressBar
            progress={progress}
            label="Course Progress"
          />
        </div>
      </div>

      {/* CHAPTERS */}

      <div
       id="course-sidebar-scroll"
        className="
      flex-1
      overflow-y-auto
      hide-scrollbar
    "
      >
        {sections.map(
          (section: any,index: number) => (
            <ChapterAccordion
              key={section.id}
              section={section}
              chapterIndex={index + 1}
              currentLecture={
                currentLecture
              }
              expandedSections={
                expandedSections
              }
              setExpandedSections={
                setExpandedSections
              }
              onLessonSelect={
                onLessonSelect
              }
              onQuizSelect={
                onQuizSelect
              }
            />
          )
        )}
      </div>

      {/* FINAL ASSESSMENT */}

      <div
        className="
      border-t
      border-[#2A2A2A]
      px-5
      py-4
      flex-shrink-0
    "
      >
        <button
          onClick={
            onFinalAssessmentSelect
          }
          disabled={
            !isAllCompleted
          }
          className="
        w-full
        flex
        items-center
        justify-between
      "
        >
          <div
            className="
          flex
          items-center
          gap-2
        "
          >
            <span>
              Final Assessment
            </span>

            {isAllCompleted && (
              <CheckCircle
                size={16}
                className="
              text-green-500
            "
              />
            )}
          </div>

          {!isAllCompleted && (
            <Lock
              size={14}
              className="
            text-gray-500
          "
            />
          )}
        </button>
      </div>
    </>


  );
};

export default SidebarContent;
