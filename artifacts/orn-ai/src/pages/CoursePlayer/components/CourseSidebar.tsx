import SidebarRail from "./sidebar/SidebarRail";
import SidebarToggle from "./sidebar/SidebarToggle";
import SidebarContent from "./sidebar/SidebarContent";


interface CourseSidebarProps {
  course: any;
  sections: any[];
  currentLecture: any;
  expandedSections: string[];
  setExpandedSections: React.Dispatch<React.SetStateAction<string[]>>;
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

    </>
  );
};

export default CourseSidebar;