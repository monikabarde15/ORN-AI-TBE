import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trophy,
} from "lucide-react";

import ChapterAccordion from "../ChapterAccordion";

interface MobileCourseContentProps {
  sections: any[];

  currentLecture: any;

  expandedSections: string[];

  setExpandedSections: React.Dispatch<
    React.SetStateAction<string[]>
  >;

  onLessonSelect: (
    lesson: any
  ) => void;

  onQuizSelect: (
    lesson: any
  ) => void;

  onFinalAssessmentSelect: () => void;
}

const MobileCourseContent = ({
  sections,
  currentLecture,
  expandedSections,
  setExpandedSections,
  onLessonSelect,
  onQuizSelect,
  onFinalAssessmentSelect,
}: MobileCourseContentProps) => {
  const [open, setOpen] =
    useState(false);

  const handleLessonClick = (
    lesson: any
  ) => {
    onLessonSelect(lesson);

    setOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleQuizClick = (
    lesson: any
  ) => {
    onQuizSelect(lesson);

    setOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

    const totalModules =
        sections.length;

    const completedModules =
        sections.filter(
            (section) => {
                const lessons =
                    section.lessons || [];

                if (
                    lessons.length === 0
                )
                    return false;

                return lessons.every(
                    (lesson: any) =>
                        lesson.completed
                );
            }
        ).length;

  return (
    <div
      className="
        lg:hidden

        bg-white

        border-b
        border-gray-200
      "
    >
      {/* Header */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          w-full

          px-4
          py-4

          flex
          items-center
          justify-between

          text-left
        "
      >
        <div>
          <p
            className="
              text-sm
              font-semibold
              text-gray-900
            "
          >
            Course Content
          </p>

                  <p className="text-xs text-gray-500 mt-1">
                      {completedModules}
                      {" / "}
                      {totalModules}
                      {" Modules Completed"}
                  </p>
        </div>

        {open ? (
          <ChevronUp
            size={18}
          />
        ) : (
          <ChevronDown
            size={18}
          />
        )}
      </button>

      {/* Content */}

      {open && (
        <div
          className="
            border-t
            border-gray-200

            max-h-[70vh]

            overflow-y-auto

            hide-scrollbar
          "
        >
          {sections.map(
            (
              section,
              index
            ) => (
              <ChapterAccordion
                key={
                  section.id
                }
                section={
                  section
                }
                chapterIndex={
                  index + 1
                }
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
                  handleLessonClick
                }
                onQuizSelect={
                  handleQuizClick
                }
              />
            )
          )}

          {/* Assessment */}

          <div
            className="
              border-t
              border-gray-200

              p-4
            "
          >
            <button
              onClick={() => {
                onFinalAssessmentSelect();

                setOpen(
                  false
                );

                window.scrollTo(
                  {
                    top: 0,
                    behavior:
                      "smooth",
                  }
                );
              }}
              className="
                w-full

                flex
                items-center
                justify-center
                gap-2

                rounded-lg

                bg-[#171717]

                px-4
                py-3

                text-white
                font-medium
              "
            >
              <Trophy
                size={18}
              />

              Certificate & Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileCourseContent;