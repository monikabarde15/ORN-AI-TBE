// components/layout/sidebar/SidebarContent.tsx

import { Link } from "wouter";
import {
  Search,
  UserPlus,
  Settings2,
  BarChart3,
  Database,
  GraduationCap,
  User as UserIcon,
} from "lucide-react";

interface SidebarContentProps {
  user: any;
  location: string;
  onNavigate?: () => void;
}

export default function SidebarContent({
  user,
  location,
  onNavigate,
}: SidebarContentProps) {
  if (!user) return null;

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
      active
        ? "bg-primary/10 text-primary font-medium"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <div className="flex flex-col gap-1">
      {user.role === "candidate" ? (
        <>
          <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Learning Hub
          </div>

          <Link
            href="#"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted"
          >
            <BarChart3 className="size-4" />
            Feed
          </Link>

          <Link
            href="#"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted"
          >
            <GraduationCap className="size-4" />
            Workshops
          </Link>

          <Link
            href="/courses"
            onClick={onNavigate}
            className={linkClass(location === "/courses")}
          >
            <GraduationCap className="size-4" />
            Courses
          </Link>

          <Link
            href="/recruiter/student-live-session"
            onClick={onNavigate}
            className={linkClass(
              location === "/recruiter/student-live-session"
            )}
          >
            <BarChart3 className="size-4" />
            Live Session Courses
          </Link>

          <Link
            href="#"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted"
          >
            <UserIcon className="size-4" />
            Messages
          </Link>

          {user?.candidateId && (
            <Link
              href={`/candidate/${user.candidateId}/evaluation`}
              onClick={onNavigate}
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

          <Link
            href="/recruiter"
            onClick={onNavigate}
            className={linkClass(location === "/recruiter")}
          >
            <Search className="size-4" />
            Talent Search
          </Link>

          <Link
            href="/admin/blog/add"
            onClick={onNavigate}
            className={linkClass(location === "/blog/add")}
          >
            <GraduationCap className="size-4" />
            Blogs
          </Link>

          <Link
            href="/recruiter/add"
            onClick={onNavigate}
            className={linkClass(location === "/recruiter/add")}
          >
            <UserPlus className="size-4" />
            Add Candidate
          </Link>

          <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            LMS & Learning Ecosystem
          </div>

          <Link
            href="/recruiter/courses"
            onClick={onNavigate}
            className={linkClass(
              location === "/recruiter/courses" ||
                location === "/recruiter/course/add"
            )}
          >
            <UserPlus className="size-4" />
            Course Management
          </Link>

          <Link
            href="/recruiter/learning-path-list"
            onClick={onNavigate}
            className={linkClass(
              location === "/recruiter/learning-path-list" ||
                location === "/recruiter/learning-path"
            )}
          >
            <UserPlus className="size-4" />
            Learning Paths
          </Link>

          <Link
            href="#"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-muted"
          >
            <UserPlus className="size-4" />
            Course Categories
          </Link>

          <Link
            href="/recruiter/live-session"
            onClick={onNavigate}
            className={linkClass(location === "/recruiter/live-session")}
          >
            <UserPlus className="size-4" />
            Live Training Sessions
          </Link>

          <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Career Transformation
          </div>

          <Link
            href="/training"
            onClick={onNavigate}
            className={linkClass(
              location.startsWith("/training") ||
                /^\/candidate\/[^/]+\/training$/.test(location)
            )}
          >
            <GraduationCap className="size-4" />
            Training Pipeline
          </Link>

          <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Platform
          </div>

          <Link
            href="/admin"
            onClick={onNavigate}
            className={linkClass(location === "/admin")}
          >
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
    </div>
  );
}