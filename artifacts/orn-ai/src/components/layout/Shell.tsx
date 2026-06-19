
// components/layout/Shell.tsx

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useAuth } from "@/hooks/use-auth";

import {
  LogIn,
  LogOut,
  User as UserIcon,
} from "lucide-react";

import DashboardSidebar from "./sidebar/DashboardSidebar";
import MobileSidebar from "./sidebar/MobileSidebar";
import MobileSidebarToggle from "./sidebar/MobileSidebarToggle";

import DashboardHeader from "./header/DashboardHeader";
import PublicHeader from "./header/PublicHeader";
import MobileHeader from "./header/MobileHeader";
import MobileGlobalMenu from "./header/MobileGlobalMenu";

import PublicFooter from "./footer/PublicFooter";

function UserMenu({ compact = false }: { compact?: boolean }) {
  const { user, logout } = useAuth();

  if (!user || !user.fullName) {
    return (
      <Link href="/login">
        <Button
          variant={compact ? "ghost" : "outline"}
          size={compact ? "sm" : "default"}
          className="gap-2"
          data-testid="button-header-login"
        >
          <LogIn className="size-4" />
          Sign in
        </Button>
      </Link>
    );
  }

  const initials = user.fullName
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 px-2"
          data-testid="button-user-menu"
        >
          <Avatar className="size-7">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>

          <span className="hidden md:inline text-sm font-medium">
            {user.fullName}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm">{user.fullName}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {user.role}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {user?.role === "admin" && (
          <Link href="/admin">
            <DropdownMenuItem className="cursor-pointer gap-2">
              <UserIcon className="size-4" />
              Dashboard
            </DropdownMenuItem>
          </Link>
        )}

        {user?.candidateId && (
          <Link href={`/candidate/${user.candidateId}/evaluation`}>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <UserIcon className="size-4" />
              My Evaluation
            </DropdownMenuItem>
          </Link>
        )}

        <DropdownMenuItem
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          onClick={async () => {
            await logout();
            window.location.href = "/login";
          }}
          data-testid="button-logout"
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Shell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const [location, setLocation] = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [mobileGlobalMenuOpen, setMobileGlobalMenuOpen] =
    useState(false);

  useEffect(() => {
    if (location === "/" && user?.role === "admin") {
      setLocation("/admin");
    }

    if (location === "/" && user?.role === "candidate") {
      setLocation(
        `/candidate/${user.candidateId}/evaluation`
      );
    }
  }, [location, user, setLocation]);

  // Close Menus On Route Change
  useEffect(() => {
    setMobileSidebarOpen(false);
    setMobileGlobalMenuOpen(false);
  }, [location]);

  // Prevent Body Scroll When Drawer Open

  useEffect(() => {
    document.body.style.overflow =
      mobileSidebarOpen || mobileGlobalMenuOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen, mobileGlobalMenuOpen]);

  const candidateRoutes = [
    "/courses",
    "/feed",
    "/workshops",
    "/messages",
  ];

  const isDashboard =
    location.startsWith("/recruiter") ||
    location.startsWith("/admin") ||
    location.startsWith("/candidate") ||
    candidateRoutes.some((route) =>
      location.startsWith(route)
    ) ||
    /^\/candidate\/[^/]+\/training$/.test(location);

  if (isDashboard) {
    return (
      <div className="min-h-[100dvh] flex w-full bg-muted/30">

        {/* Global Mobile Menu */}
        <MobileGlobalMenu
          open={mobileGlobalMenuOpen}
          onClose={() =>
            setMobileGlobalMenuOpen(false)
          }
          user={user}
        />

        {/* Role Navigation */}
        <MobileSidebar
          open={mobileSidebarOpen}
          onClose={() =>
            setMobileSidebarOpen(false)
          }
          user={user}
          location={location}
        />

        {/* Floating Sidebar Toggle */}
        <MobileSidebarToggle
          open={mobileSidebarOpen}
          onClick={() =>
            setMobileSidebarOpen(prev => !prev)
          }
        />

        {/* Desktop Sidebar */}
        <DashboardSidebar
          user={user}
          location={location}
          UserMenu={UserMenu}
        />

        <div className="flex-1 lg:pl-64 flex flex-col">

          {/* Mobile / Tablet Header */}
          <div className="lg:hidden">
            <MobileHeader
              onMenuClick={() =>
                setMobileGlobalMenuOpen(true)
              }
              UserMenu={UserMenu}
            />
          </div>

<<<<<<< HEAD
          <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
            {user?.role === "candidate" ? (
              <>
                <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Learning Hub
                </div>

                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                  <BarChart3 className="size-4" />
                  Feed
                </Link>
                

                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                  <GraduationCap className="size-4" />
                  Workshops
                </Link>

                <Link href="/courses" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/courses" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <GraduationCap className="size-4" />
                  Courses
                </Link>
                <Link href="/recruiter/student-live-session" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter/student-live-session" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <BarChart3 className="size-4" />
                  Live Session Courses
                </Link>

                

                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                  <UserIcon className="size-4" />
                  Messages
                </Link>
                {user?.candidateId && (
                  <Link
                    href={`/candidate/${user.candidateId}/evaluation`}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted"
                  >
                    <BarChart3 className="size-4" />
                    My Evaluation
                  </Link>
                )}
              </>
            ) : (
              <>
                <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Recruitment
                      </div>
                      <Link href="/recruiter" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                        <Search className="size-4" />
                        Talent Search
                      </Link>
                      <Link href="/admin/blog/add" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/blog/add" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} data-testid="link-nav-add-blogs">
                        <GraduationCap className="size-4" />
                        Blogs
                      </Link>
                      <Link href="/recruiter/add" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter/add" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} data-testid="link-nav-add-candidate">
                        <UserPlus className="size-4" />
                        Add Candidate
                      </Link>
                       <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        LMS & Learning Ecosystem
                      </div>
                      <Link href="/recruiter/categories" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter/categories"  ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} data-testid="link-nav-add-candidate">
                        <UserPlus className="size-4" />
                        Course Categories
                      </Link>
                      <Link href="/recruiter/courses" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter/courses" || location === "/recruiter/course/add" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} data-testid="link-nav-add-candidate">
                        <UserPlus className="size-4" />
                       Course Management
                      </Link>

                      <Link href="/recruiter/learning-path-list" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location == "/recruiter/learning-path-list" || location == "/recruiter/learning-path" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} data-testid="link-nav-add-candidate">
                        <UserPlus className="size-4" />
                        Learning Paths
                      </Link>

                      
                      <Link href="/recruiter/live-session" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter/live-session" || location === "/recruiter/live-session" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} data-testid="link-nav-live-session">
                        <UserPlus className="size-4" />
                       Live Training Sessions
                      </Link>

                      <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Career Transformation
                      </div>
                      <Link
                        href="/training"
                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location.startsWith("/training") || /^\/candidate\/[^/]+\/training$/.test(location) ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                        data-testid="link-nav-training"
                      >
                        <GraduationCap className="size-4" />
                        Training Pipeline
                      </Link>

                      <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Platform 
                      </div>

                      <Link href="/admin" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/admin" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                        <BarChart3 className="size-4" />
                        Overview
                      </Link>
                      <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground/50 cursor-not-allowed">
                        <Database className="size-4" />
                        Data Sources
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground/50 cursor-not-allowed">
                        <Settings2 className="size-4" />
                        Settings
                      </div>
              </>
            )}
           
=======
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <DashboardHeader
              user={user}
              UserMenu={UserMenu}
            />
>>>>>>> 21994ff1d3d984ba37d86cf566b842e1e25f3eec
          </div>

          <main className="flex-1">
            {children}
          </main>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">

      {/* Mobile Global Menu */}
      <MobileGlobalMenu
        open={mobileGlobalMenuOpen}
        onClose={() =>
          setMobileGlobalMenuOpen(false)
        }
        user={user}
      />

      {/* Mobile Header */}
      <div className="lg:hidden">
        <MobileHeader
          onMenuClick={() =>
            setMobileGlobalMenuOpen(true)
          }
          UserMenu={UserMenu}
        />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <PublicHeader
          user={user}
          UserMenu={UserMenu}
        />
      </div>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <PublicFooter />
    </div>
  );
}

