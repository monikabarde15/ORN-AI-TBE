import { Menu, X, Search } from "lucide-react";
import ChapterAccordion from "./ChapterAccordion";
import ProgressBar from "./ProgressBar";

interface CourseSidebarProps {
  course: any;
  sections: any[];

  currentLecture: any;

  expandedSections: string[];

  setExpandedSections: React.Dispatch<
    React.SetStateAction<string[]>
  >;

  sidebarOpen: boolean;

  setSidebarOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  onLessonSelect: (
    lesson: any
  ) => void;

  onQuizSelect: (
    lesson: any
  ) => void;

  onAboutSelect: () => void;
  onFinalAssessmentSelect: () => void;
}

const CourseSidebar = ({
  course,
  sections,

  currentLecture,

  expandedSections,
  setExpandedSections,

  sidebarOpen,
  setSidebarOpen,

  onLessonSelect,
  onQuizSelect,
  onAboutSelect,
  onFinalAssessmentSelect,
}: CourseSidebarProps) => {
  // const progress = 35;
  
  const totalItems = sections.reduce(
  (acc, section) =>
    acc +
    section.lessons.length +
    section.lessons.reduce(
      (quizAcc: number, lesson: any) =>
        quizAcc +
        (lesson.quizzes?.length > 0 ? 1 : 0),
      0
    ),
  0
);
const totalLessons = sections.reduce(
  (acc, section) =>
    acc + section.lessons.length,
  0
);

const totalQuizzes = sections.reduce(
  (acc, section) =>
    acc +
    section.lessons.filter(
      (lesson: any) =>
        lesson.quizzes?.length > 0
    ).length,
  0
);

const completedQuizzes =
  sections.reduce(
    (acc, section) =>
      acc +
      section.lessons.filter(
        (lesson: any) =>
          localStorage.getItem(
            `quiz_${lesson.id}`
          ) === "completed"
      ).length,
    0
  );

const progress =
  totalQuizzes > 0
    ? Math.round(
        (completedQuizzes /
          totalQuizzes) *
          100
      )
    : 0;

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="border-b border-[#1f1f1f] p-6">
        <button
          className="
            mb-8
            text-sm
            font-medium
            text-white
            transition-colors
            hover:text-red-500
          "
        >
          Back to Dashboard
        </button>

        <button
          onClick={onAboutSelect}
          className="w-full text-center"
        >
          <h2
            className="
              text-[28px]
              font-bold
              leading-tight
              text-white
            "
          >
            {course?.courseName ||
              "Loading Course..."}
          </h2>
        </button>

        {/* Progress */}
        <div className="mt-8">
          <ProgressBar
            progress={progress}
          />
        </div>

        {/* Add Note */}
        {/* <button
          className="
            mt-6
            h-12
            w-full
            rounded-md
            bg-red-700
            font-medium
            text-white
            transition-colors
            hover:bg-red-800
          "
        >
          Add A New Note
        </button> */}

        {/* Search */}
        {/* <div className="relative mt-4">
          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="search lessons..."
            className="
              h-12
              w-full
              rounded-md
              border
              border-gray-300
              bg-white
              pl-11
              pr-4
              text-black
              outline-none
              focus:border-red-500
            "
          />
        </div> */}
      </div>

      {/* Chapters */}
      <div
        className="
    flex-1
    overflow-y-auto
    overflow-x-hidden

    [scrollbar-width:none]
    [-ms-overflow-style:none]

    [&::-webkit-scrollbar]:w-0
    [&::-webkit-scrollbar]:hidden
  "
      >
        {sections.map((section: any) => (
          <ChapterAccordion
            key={section.id}
            section={section}
            currentLecture={currentLecture}
            expandedSections={expandedSections}
            setExpandedSections={setExpandedSections}
            onLessonSelect={onLessonSelect}
            onQuizSelect={onQuizSelect}
          />
        ))}
      </div>

      {/* Final Assessment */}
      {progress === 100 && (
      <div
        className="
          border-t
          border-[#1f1f1f]
          px-6
          py-5
        "
      >
        <button
          className="
            text-left
            text-lg
            font-semibold
            text-white
            transition-colors
            hover:text-red-500
          "
          onClick={onFinalAssessmentSelect}
        >
          Final Assessment
        </button>
      </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="
    hidden
    lg:flex

    w-[480px]
    shrink-0

    h-screen
    overflow-hidden

    flex-col

    bg-gradient-to-b
from-[#0B1020]
via-[#111827]
to-[#0F172A]
    text-white
  "
      >
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="
            fixed
            left-4
            top-4
            z-50
            rounded-lg
            bg-gradient-to-b
            from-[#0B1020]
            via-[#111827]
            to-[#0F172A]
            p-3
            text-white
            lg:hidden
          "
        >
          <Menu size={22} />
        </button>
      )}

      {/* Mobile Drawer */}
      <div
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-[360px]
          bg-gradient-to-b
          from-[#0B1020]
          via-[#111827]
          to-[#0F172A]
          text-white
          transform
          transition-transform
          duration-300
          lg:hidden
          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >
        <div className="flex items-center justify-end border-b border-[#1f1f1f] p-4">
          <button
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(100%-72px)] flex-col">
          <SidebarContent />
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            lg:hidden
          "
        />
      )}
    </>
  );
};

export default CourseSidebar;