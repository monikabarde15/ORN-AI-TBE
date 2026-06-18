import { Check, Circle, FileText, PlayCircle, HelpCircle } from "lucide-react";

interface LessonItemProps {
  lesson: any;
  isActive: boolean;
  isCompleted?: boolean;
  onClick: () => void;
  lessonIndex?: number;
}

const LessonItem = ({
  lesson,
  lessonIndex,
  isActive,
  isCompleted = false,
  onClick,
}: LessonItemProps) => {
  const isQuiz = lesson.type === "quiz" || lesson.title?.toLowerCase().includes("quiz");
  const isVideo = lesson.videoUrl;
  const isPdf = lesson.pdfUrl;

  // Render status icon (checkbox)
  const renderStatusIcon = () => {
    if (isCompleted) {
      return (
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          <Check size={16} className="text-green-500" />
        </div>
      );
    }
    return (
      <div className="w-5 h-5 flex items-center justify-center shrink-0">
        <Circle size={16} className="text-gray-500" />
      </div>
    );
  };

  // Render type icon
  const renderTypeIcon = () => {
    if (isQuiz) {
      return <HelpCircle size={16} className="text-purple-400 shrink-0" />;
    }
    if (isPdf) {
      return <FileText size={16} className="text-blue-400 shrink-0" />;
    }
    if (isVideo) {
      return <PlayCircle size={16} className="text-red-500 shrink-0" />;
    }
    return <FileText size={16} className="text-gray-400 shrink-0" />;
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-3 py-2 lg:px-4 lg:py-2.5
        flex items-center gap-2 lg:gap-3
        transition-all duration-200
        border-l-2
        ${
          isActive
            ? "bg-[#243247] border-red-600"
            : "bg-transparent border-transparent hover:bg-[#1F2A3A]"
        }
      `}
    >
      {/* Status Icon */}
      {renderStatusIcon()}

      {/* Type Icon */}
      <div className="shrink-0">{renderTypeIcon()}</div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <div className="mb-0.5">
          <span
            className="
        text-[10px]
        uppercase
        tracking-wider
        text-gray-500
        font-medium
      "
          >
            {isQuiz
              ? "QUIZ"
              : isPdf
                ? "PDF"
                : `LESSON ${String(
                  lessonIndex || 0
                ).padStart(2, "0")}`}
          </span>
        </div>

        <p
          className={`
      text-xs
      lg:text-sm
      font-medium
      truncate

      ${isActive
              ? "text-white"
              : "text-gray-300"
            }

      ${isCompleted &&
              !isActive
              ? "text-green-400"
              : ""
            }
    `}
        >
          {lesson.title}
        </p>

        {!isQuiz &&
          lesson.duration && (
            <p
              className="
          text-[10px]
          lg:text-xs
          text-gray-500
          mt-0.5
        "
            >
              {lesson.duration}
            </p>
          )}
      </div>
    </button>
  );
};

export default LessonItem;