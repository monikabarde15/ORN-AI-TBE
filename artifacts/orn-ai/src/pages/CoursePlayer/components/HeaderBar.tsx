import { Menu } from "lucide-react";

interface HeaderBarProps {
  title?: string;

  onOpenSidebar?: () => void;
}

const HeaderBar = ({
  title,
  onOpenSidebar,
}: HeaderBarProps) => {
  return (
    <div
      className="
        sticky
        top-0
        z-20
        border-b
        bg-white/90
        backdrop-blur
      "
    >
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="
              lg:hidden
              rounded-lg
              p-2
              hover:bg-gray-100
            "
          >
            <Menu size={20} />
          </button>

          <h1 className="text-lg font-semibold">
            {title || "Course Player"}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;