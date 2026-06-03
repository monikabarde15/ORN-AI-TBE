import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import LessonItem from "./LessonItem";

interface ChapterAccordionProps {
  section: any;

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
}

const ChapterAccordion = ({
  section,
  currentLecture,
  expandedSections,
  setExpandedSections,
  onLessonSelect,
  onQuizSelect,
}: ChapterAccordionProps) => {
  const isExpanded =
    expandedSections.includes(
      section.id
    );

  const toggleSection = () => {
    setExpandedSections(
      (prev) =>
        prev.includes(section.id)
          ? prev.filter(
              (item) =>
                item !== section.id
            )
          : [...prev, section.id]
    );
  };

  // temporary
const completedLessons =
  section.lessons.filter(
    (lesson: any) =>
      lesson.completed &&
      (
        !lesson.quizzes?.length ||
        lesson.quizCompleted
      )
  ).length;
  return (
    <div className="border-b border-[#1f1f1f]">
      {/* Chapter Header */}
      <button
        onClick={toggleSection}
        className="
          w-full
          bg-[#171717]
          px-5
          py-5
          flex
          items-center
          justify-between
          text-left
        "
      >
        <div>
          <h3
            className="
              text-white
              font-semibold
              text-[18px]
              leading-tight
            "
          >
            {section.title}
          </h3>

          <p
            className="
              mt-1
              text-[13px]
              font-medium
              text-white
            "
          >
            {completedLessons} out of{" "}
            {section.lessons?.length || 0}{" "}
            lessons completed
          </p>
        </div>

        {isExpanded ? (
          <ChevronUp
            size={20}
            className="text-white"
          />
        ) : (
          <ChevronDown
            size={20}
            className="text-white"
          />
        )}
      </button>

      {/* Lessons */}
      {isExpanded && (
        <div
          className="
            bg-black
            course-sidebar-scroll
          "
        >
          {section.lessons?.map(
            (lesson: any) => (
              <div
                key={lesson.id}
              >
                <LessonItem
                  lesson={lesson}
                  isActive={
                    currentLecture?.id ===
                    lesson.id
                  }
                  onClick={() =>
                    onLessonSelect(
                      lesson
                    )
                  }
                />

                {lesson.quizzes
                  ?.length > 0 && (
                  <LessonItem
                    lesson={{
                      id: `${lesson.id}-quiz`,
                      title: `${section.title} Quiz`,
                      type: "quiz",
                    }}
                    isActive={false}
                    onClick={() =>
                      onQuizSelect(
                        lesson
                      )
                    }
                  />
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ChapterAccordion;
