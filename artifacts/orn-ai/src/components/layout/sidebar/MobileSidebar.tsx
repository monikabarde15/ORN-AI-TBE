// components/layout/sidebar/MobileSidebar.tsx

import { X } from "lucide-react";

import SidebarContent from "./SidebarContent";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  user: any;
  location: string;
}

export default function MobileSidebar({
  open,
  onClose,
  user,
  location,
}: MobileSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 bg-background border-r z-50
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="h-16 border-b flex items-center justify-between px-4">
          <h2 className="font-semibold text-sm">
            Navigation
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto px-3 py-4">
          <SidebarContent
            user={user}
            location={location}
            onNavigate={onClose}
          />
        </div>
      </aside>
    </>
  );
}