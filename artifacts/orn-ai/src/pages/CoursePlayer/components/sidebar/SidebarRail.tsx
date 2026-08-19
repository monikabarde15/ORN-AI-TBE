import { Trophy } from "lucide-react";

interface SidebarRailProps {
  sections: any[];

  currentLecture: any;

  setSidebarCollapsed: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  setExpandedSections: React.Dispatch<
    React.SetStateAction<string[]>
  >;

  onFinalAssessmentSelect: () => void;
}

const SidebarRail = ({
  sections,
  currentLecture,
  setSidebarCollapsed,
  setExpandedSections,
  onFinalAssessmentSelect,
}: SidebarRailProps) => {

  const handleChapterClick = (
    sectionId: string
  ) => {
    setSidebarCollapsed(false);

    setExpandedSections([
      sectionId,
    ]);

    setTimeout(() => {
      const container =
        document.getElementById(
          "course-sidebar-scroll"
        );

      const section =
        document.getElementById(
          `section-${sectionId}`
        );

      if (
        !container ||
        !section
      )
        return;

      const containerTop =
        container.getBoundingClientRect().top;

      const sectionTop =
        section.getBoundingClientRect().top;

      const offset =
        sectionTop -
        containerTop;

      container.scrollTo({
        top:
          container.scrollTop +
          offset -
          20,
        behavior: "smooth",
      });
    }, 250);
  };

  const isSectionActive = (
    section: any
  ) => {
    return section.lessons?.some(
      (lesson: any) =>
        lesson.id ===
        currentLecture?.id
    );
  };

  return (
    <div
      className="
    h-full
    flex
    flex-col
    overflow-hidden
  "
    >

      <div
        className="
    flex
    items-center
    justify-center

    w-full

    py-4

    border-b
    border-[#2A2A2A]

    mb-4
  "
      >
        <div
          className="
      w-10
      h-10

      rounded-xl

      bg-[#242424]

      flex
      items-center
      justify-center

      text-sm
      font-bold
      text-white
    "
        >
          ORN
        </div>
      </div>
      {/* CHAPTERS */}

      <div
        className="
        flex-1
        overflow-y-auto
        flex
        flex-col
        gap-2
        items-center
        py-4
        hide-scrollbar
  "
      >
        {sections.map(
          (
            section: any,
            index: number
          ) => (
            <div
              key={section.id}
              className="group relative"
            >
              <button
                onClick={() =>
                  handleChapterClick(section.id)
                }
                className={`
      w-11
      h-11

      rounded-xl

      flex
      items-center
      justify-center

      text-sm
      font-semibold

      transition-all
      duration-200

      ${isSectionActive(section)
                    ? `
            bg-white
            text-[#171717]
            shadow-lg
            scale-105
          `
                    : `
            bg-[#222]
            text-gray-400

            hover:bg-[#2F2F2F]
            hover:text-white
          `
                  }
    `}
              >
                {String(index + 1).padStart(2, "0")}
              </button>

              <div
                className="
      absolute

      left-14
      group-hover:left-16
      top-1/2

      -translate-y-1/2

      whitespace-nowrap

      rounded-lg

      bg-[#222]

      px-3
      py-2

      text-xs
      text-white

      opacity-0

      pointer-events-none

      group-hover:opacity-100

      transition-all

      z-50
    "
              >
                {section.title}
              </div>
            </div>
          )
        )}
      </div>

      {/* CERTIFICATE & PROGRESS */}

      <div
        className="
    border-t
    border-[#2A2A2A]

    p-3

    flex
    justify-center

    flex-shrink-0
  "
      >
        <button
          title="Certificate & Progress"
          onClick={
            onFinalAssessmentSelect
          }
          className="
            w-11
            h-11

            rounded-xl

            flex
            items-center
            justify-center

            bg-[#222]

            text-yellow-500

            hover:bg-[#2F2F2F]

            transition-all
          "
        >
          <Trophy
            className="
              w-5
              h-5
            "
          />
        </button>
      </div>
    </div>
  );
};

export default SidebarRail;