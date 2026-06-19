// components/layout/header/DashboardHeader.tsx

import { Link } from "wouter";

interface DashboardHeaderProps {
  user: any;
  UserMenu: React.ComponentType<{ compact?: boolean }>;
}

export default function DashboardHeader({
  user,
  UserMenu,
}: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b bg-background sticky top-0 z-40">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          {user?.role === "candidate" && (
            <nav className="hidden xl:flex items-center gap-6 text-sm">
              <Link href="#">Feed</Link>

              <Link href="#">Workshops</Link>

              <Link href="/courses">
                Courses
              </Link>

              <Link href="#">
                Messages
              </Link>
            </nav>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}