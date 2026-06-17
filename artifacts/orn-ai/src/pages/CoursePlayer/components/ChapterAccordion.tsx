import { ChevronDown, ChevronUp } from "lucide-react";
import LessonItem from "./LessonItem";

interface ChapterAccordionProps {
  section: any;
  currentLecture: any;
  expandedSections: string[];
  setExpandedSections: React.Dispatch<React.SetStateAction<string[]>>;
  onLessonSelect: (lesson: any) => void;
  onQuizSelect: (lesson: any) => void;
}

const ChapterAccordion = ({
  section,
  currentLecture,
  expandedSections,
  setExpandedSections,
  onLessonSelect,
  onQuizSelect,
}: ChapterAccordionProps) => {
  const isExpanded = expandedSections.includes(section.id);

  const toggleSection = () => {
    setExpandedSections((prev) =>
      prev.includes(section.id)
        ? prev.filter((id) => id !== section.id)
        : [...prev, section.id]
    );
  };

  // Calculate completed lessons in this chapter
  const completedLessons = section.lessons?.filter((lesson: any) => {
    // Lesson is completed if completed flag is true
    if (lesson.completed) {
      // If it has quizzes, check if quiz is also completed
      if (lesson.quizzes?.length > 0) {
        return lesson.quizCompleted === true;
      }
      return true;
    }
    return false;
  }).length || 0;

  const totalLessons = section.lessons?.length || 0;

  // Extract chapter number for quiz title
  const chapterMatch = section.title?.match(/Chapter\s+(\d+)/i);
  const chapterNum = chapterMatch ? chapterMatch[1] : "";

  return (
    <div className="border-b border-[#2A2A2A]">
      {/* Chapter Header */}
      <button
        onClick={toggleSection}
        className="
          w-full bg-[#171717] px-4 py-3 lg:px-5 lg:py-4
          flex items-center justify-between
          text-left hover:bg-[#1F1F1F] transition-colors
          group
        "
      >
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-white font-semibold text-sm lg:text-[15px] leading-tight truncate">
            {section.title}
          </h3>
          <p className="mt-0.5 text-xs lg:text-[13px] font-medium text-gray-400">
            {completedLessons} out of {totalLessons} lessons completed
          </p>
        </div>
        <div className="shrink-0">
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-400 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown size={20} className="text-gray-400 group-hover:text-white transition-colors" />
          )}
        </div>
      </button>

      {/* Lessons List */}
      {isExpanded && (
        <div className="bg-[#0D0D0D] pb-1">
          {section.lessons?.map((lesson: any) => {
            const hasQuiz = lesson.quizzes?.length > 0;

            return (
              <div key={lesson.id}>
                {/* Main Lesson */}
                <LessonItem
                  lesson={lesson}
                  isActive={currentLecture?.id === lesson.id}
                  isCompleted={lesson.completed || false}
                  onClick={() => onLessonSelect(lesson)}
                />

                {/* Quiz Item (if lesson has quiz) */}
                {hasQuiz && (
                  <LessonItem
                    lesson={{
                      id: `${lesson.id}-quiz`,
                      title: `Chapter ${chapterNum} Quiz`,
                      type: "quiz",
                      duration: "5 mins",
                    }}
                    isActive={currentLecture?.id === `${lesson.id}-quiz`}
                    isCompleted={lesson.quizCompleted || false}
                    onClick={() => onQuizSelect(lesson)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChapterAccordion;