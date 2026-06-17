import { useState, useCallback } from "react";
import { Menu, X, ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import ChapterAccordion from "./ChapterAccordion";
import ProgressBar from "./ProgressBar";

interface CourseSidebarProps {
  course: any;
  sections: any[];
  currentLecture: any;
  expandedSections: string[];
  setExpandedSections: React.Dispatch<React.SetStateAction<string[]>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onLessonSelect: (lesson: any) => void;
  onQuizSelect: (lesson: any) => void;
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
  const [, setLocation] = useLocation();

  // Calculate overall progress
  const calculateProgress = useCallback(() => {
    let totalItems = 0;
    let completedItems = 0;

    sections.forEach((section) => {
      section.lessons?.forEach((lesson: any) => {
        // Count lesson
        totalItems++;
        if (lesson.completed) {
          completedItems++;
        }

        // Count quiz if it exists
        if (lesson.quizzes?.length > 0) {
          totalItems++;
          if (lesson.quizCompleted) {
            completedItems++;
          }
        }
      });
    });

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [sections]);

  const progress = calculateProgress();
  const isAllCompleted = progress === 100 && sections.length > 0;

  // Count total lessons and quizzes
  const getTotalItems = useCallback(() => {
    let total = 0;
    sections.forEach((section) => {
      section.lessons?.forEach((lesson: any) => {
        total++;
        if (lesson.quizzes?.length > 0) {
          total++;
        }
      });
    });
    return total;
  }, [sections]);

  const handleBackToDashboard = () => {
    setLocation("/courses");
  };

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="border-b border-[#2A2A2A] px-5 py-4 lg:px-6 lg:py-5 flex-shrink-0">
        {/* Brand + Back */}
        <div className="flex items-center justify-between mb-4 lg:mb-5">
          <button
            onClick={handleBackToDashboard}
            className="
              flex items-center gap-1.5
              text-xs lg:text-sm font-medium text-gray-400 
              hover:text-white transition-colors
              group
            "
          >
            <ArrowLeft size={16} className="group-hover:translate-x-[-2px] transition-transform" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
        </div>

        {/* Course Title */}
        <button onClick={onAboutSelect} className="w-full text-left group">
          <h2
            className="
              text-xl lg:text-2xl xl:text-[26px]
              font-bold leading-tight
              text-white group-hover:text-blue-900
              transition-colors line-clamp-2
            "
          >
            {course?.title || "Loading Course..."}
          </h2>
        </button>

        {/* Progress */}
        <div className="mt-4">
          <ProgressBar progress={progress} label="Course Progress" />
        </div>

        {/* Stats */}
        {/* <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
          <span>{getTotalItems()} items</span>
          <span>•</span>
          <span>{sections.length} chapters</span>
        </div> */}
      </div>

      {/* Chapters - Scrollable with HIDDEN scrollbar */}
      <div
        className="
          flex-1 overflow-y-auto overflow-x-hidden
          scrollbar-hide
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
          [&::-webkit-scrollbar]:w-0
        "
      >
        {sections.length > 0 ? (
          sections.map((section: any) => (
            <ChapterAccordion
              key={section.id}
              section={section}
              currentLecture={currentLecture}
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
              onLessonSelect={onLessonSelect}
              onQuizSelect={onQuizSelect}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500 text-sm">No lessons available</p>
          </div>
        )}
      </div>

      {/* Final Assessment */}
      <div className="border-t border-[#2A2A2A] px-5 py-3 lg:px-6 lg:py-4 bg-[#171717] flex-shrink-0">
        <button
          onClick={onFinalAssessmentSelect}
          disabled={!isAllCompleted}
          className={`
            w-full text-left
            text-sm lg:text-[15px] font-semibold
            transition-all duration-200
            flex items-center justify-between
            ${isAllCompleted 
              ? "text-white hover:text-red-500 cursor-pointer" 
              : "text-gray-600 cursor-not-allowed opacity-50"
            }
          `}
        >
          <div className="flex items-center gap-2">
            <span>Final Assessment</span>
            {isAllCompleted && (
              <CheckCircle size={16} className="text-green-500" />
            )}
          </div>
          {!isAllCompleted && (
            <div className="flex items-center gap-1 text-xs font-normal text-gray-500">
              <Lock size={12} />
              <span className="hidden sm:inline">Locked</span>
            </div>
          )}
          {isAllCompleted && (
            <span className="text-xs font-normal text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Ready
            </span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Sticky with hidden scrollbar */}
      <aside
        className="
          hidden lg:flex
          w-[380px] xl:w-[420px] 2xl:w-[460px]
          shrink-0
          h-screen
          sticky
          top-0
          flex-col
          bg-[#171717] text-white
          border-r border-[#2A2A2A]
        "
      >
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            fixed left-4 top-4 z-50
            rounded-lg bg-[#171717] p-2.5
            text-white lg:hidden
            hover:bg-[#2A2A2A] transition-colors
            border border-[#2A2A2A]
            shadow-lg
          "
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Mobile Drawer */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50
          w-[320px] sm:w-[380px]
          bg-[#171717] text-white
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          shadow-2xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between border-b border-[#2A2A2A] px-4 py-3.5 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(false)}
            className="hover:opacity-70 transition-opacity p-1"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex h-[calc(100%-56px)] flex-col overflow-hidden">
          <SidebarContent />
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default CourseSidebar;