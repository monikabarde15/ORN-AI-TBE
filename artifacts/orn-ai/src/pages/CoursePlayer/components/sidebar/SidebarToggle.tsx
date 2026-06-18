import {
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

const SidebarToggle = ({
  collapsed,
  onToggle,
}: SidebarToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="
        absolute
        top-6
        -right-3
        z-30

        flex
        items-center
        justify-center

        w-7
        h-7

        rounded-full

        bg-white
        border
        border-gray-200

        shadow-lg

        hover:scale-105
        transition-all
      "
    >
      {collapsed ? (
        <PanelLeftOpen
          className="
            w-4
            h-4
            text-gray-700
          "
        />
      ) : (
        <PanelLeftClose
          className="
            w-4
            h-4
            text-gray-700
          "
        />
      )}
    </button>
  );
};

export default SidebarToggle;