// components/layout/sidebar/DashboardSidebar.tsx

import { Link } from "wouter";

import ornAiLogo from "@assets/logo_1777984164420.jpg";

import SidebarContent from "./SidebarContent";

interface DashboardSidebarProps {
  user: any;
  location: string;
  UserMenu: React.ComponentType;
}

export default function DashboardSidebar({
  user,
  location,
  UserMenu,
}: DashboardSidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 border-r bg-background flex-col fixed inset-y-0 z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b shrink-0">
        <Link href="/" className="flex items-center" aria-label="ORN-AI home">
          <img
            src={ornAiLogo}
            alt="ORN-AI"
            className="h-9 w-auto object-contain rounded-lg"
          />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 overflow-y-auto">
        <SidebarContent
          user={user}
          location={location}
        />
      </div>

      {/* User Menu */}
      {/* <div className="border-t p-3 shrink-0">
        <UserMenu />
      </div> */}
    </aside>
  );
}