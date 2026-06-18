import { Menu, X } from "lucide-react";
import SidebarRail from "./sidebar/SidebarRail";
import SidebarToggle from "./sidebar/SidebarToggle";
import SidebarContent from "./sidebar/SidebarContent";


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
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const CourseSidebar = ({
  course,
  sections,
  currentLecture,
  expandedSections,
  setExpandedSections,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  onLessonSelect,
  onQuizSelect,
  onAboutSelect,
  onFinalAssessmentSelect,
}: CourseSidebarProps) => {




  return (
    <>
      {/* Desktop Sidebar - Sticky with hidden scrollbar */}
      <aside
        className={`
    hidden lg:flex
    shrink-0
    h-screen
    sticky
    top-0
    flex-col
    bg-[#171717]
    text-white
    border-r border-[#2A2A2A]
    transition-all duration-300

    ${sidebarCollapsed
            ? "w-[72px]"
            : "w-[380px] xl:w-[420px] 2xl:w-[460px]"
          }
  `}
      >
        <SidebarToggle
          collapsed={sidebarCollapsed}
          onToggle={() =>
            setSidebarCollapsed(
              !sidebarCollapsed
            )
          }
        />
        {sidebarCollapsed ? (
          <SidebarRail
            sections={sections}
            currentLecture={
              currentLecture
            }
            setSidebarCollapsed={
              setSidebarCollapsed
            }
            setExpandedSections={
              setExpandedSections
            }
            onFinalAssessmentSelect={
              onFinalAssessmentSelect
            }
          />
        ) : (
          <SidebarContent
            course={course}
            sections={sections}
            currentLecture={currentLecture}
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
            onAboutSelect={
              onAboutSelect
            }
            onFinalAssessmentSelect={
              onFinalAssessmentSelect
            }
          />
        )}
      </aside>

      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            fixed left-4 top-24 z-50
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
          <SidebarContent
            course={course}
            sections={sections}
            currentLecture={currentLecture}
            expandedSections={expandedSections}
            setExpandedSections={setExpandedSections}
            onLessonSelect={onLessonSelect}
            onQuizSelect={onQuizSelect}
            onAboutSelect={onAboutSelect}
            onFinalAssessmentSelect={onFinalAssessmentSelect}
          />
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