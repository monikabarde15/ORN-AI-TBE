
// components/layout/sidebar/MobileSidebarToggle.tsx

import {
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";

interface MobileSidebarToggleProps {
  open: boolean;
  onClick: () => void;
}

export default function MobileSidebarToggle({
  open,
  onClick,
}: MobileSidebarToggleProps) {
  return (
    <button
      onClick={onClick}
      aria-label={
        open
          ? "Close navigation"
          : "Open navigation"
      }
      className="
        fixed
        left-0
        top-[70px]

        z-[65]

        lg:hidden

        flex
        items-center
        justify-center

        h-10
        w-10

        rounded-r-xl

        border
        border-l-0

        bg-background/95
        backdrop-blur-md

        shadow-lg

        hover:bg-muted

        transition-all
        duration-200
      "
    >
      {open ? (
        <PanelLeftClose className="h-4 w-4" />
      ) : (
        <PanelLeftOpen className="h-4 w-4" />
      )}
    </button>
  );
}

