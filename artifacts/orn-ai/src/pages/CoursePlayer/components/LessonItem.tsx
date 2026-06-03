import {
  PlayCircle,
  FileText,
  CheckCircle,
} from "lucide-react";

interface LessonItemProps {
  lesson: any;

  isActive: boolean;

  onClick: () => void;
}

const LessonItem = ({
  lesson,
  isActive,
  onClick,
}: LessonItemProps) => {
  const isQuiz =
    lesson.type === "quiz";

  const isVideo =
    lesson.videoUrl;

  const isPdf =
    lesson.pdfUrl;

  const renderIcon = () => {
    if (isQuiz) {
      return (
        <CheckCircle
          size={18}
          className="text-green-500 shrink-0"
        />
      );
    }

    if (isPdf) {
      return (
        <FileText
          size={18}
          className="text-blue-400 shrink-0"
        />
      );
    }

    return (
      <PlayCircle
        size={18}
        className="text-red-500 shrink-0"
      />
    );
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full
        text-left
        px-4
        py-3
        flex
        items-start
        gap-3
        transition-all
        duration-200
        border-l-2

        ${
          isActive
            ? "bg-[#243247] border-red-500"
            : "bg-transparent border-transparent hover:bg-[#202C3F]"
        }
      `}
    >
      <div className="mt-0.5">
        {renderIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`
            text-sm
            font-medium
            truncate

            ${
              isActive
                ? "text-white"
                : "text-gray-300"
            }
          `}
        >
          {lesson.title}
        </p>

        {!isQuiz &&
          lesson.duration && (
            <p className="text-xs text-gray-500 mt-1">
              {lesson.duration}
            </p>
          )}
      </div>
    </button>
  );
};

export default LessonItem;