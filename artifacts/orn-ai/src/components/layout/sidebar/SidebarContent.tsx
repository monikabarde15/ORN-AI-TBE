// components/layout/sidebar/SidebarContent.tsx

import { Link } from "wouter";
import api from "../../../../services/api";
import React, {
  useEffect,
  useState,
} from "react";
import { History } from "lucide-react";
import {
  Search,
  UserPlus,
  Settings,
  Settings2,
  BarChart3,
  Database,
  GraduationCap,
  User as UserIcon,
} from "lucide-react";
import AddUserModal from "@/components/ui/AddUserModal";

interface SidebarContentProps {
  user: any;
  location: string;
  onNavigate?: () => void;
}
interface Permission {
  moduleName: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
export default function SidebarContent({
  user,
  location,
  onNavigate,
}: SidebarContentProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadPermissions();
    }
  }, [user?.id]);

  const loadPermissions = async () => {
    try {
      const { data } = await api.get(
        `/api/user-permissions/${user.id}`
      );

      setPermissions(data.permissions || []);
    } catch (error) {
      console.error(error);
    }
  };
  const hasPermission = (
    moduleName: string,
    action = "canView"
  ) => {
    if (user?.role === "admin") {
      return true;
    }

    return permissions.some(
      (permission) =>
        permission.moduleName === moduleName &&
        permission[action as keyof Permission]
    );
  };
  if (!user) return null;

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${active
      ? "bg-primary/10 text-primary font-medium"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <>
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
              href="/recruiter/learning-student-path-list"
              onClick={onNavigate}
              className={linkClass(location === "/recruiter/learning-student-path-list")}
            >
              <GraduationCap className="size-4" />
             Learning Path
            </Link>
            <Link
              href="/test-assignment"
              onClick={onNavigate}
              className={linkClass(location === "/recruiter/learning-student-path-list")}
            >
              <GraduationCap className="size-4" />
             Assignment
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
            {hasPermission("Talent Search") && (
              <Link
                href="/recruiter"
                onClick={onNavigate}
                className={linkClass(location === "/recruiter")}
              >
                <Search className="size-4" />
                Talent Search
              </Link>
            )}
              <Link
                href="/recruiter-history"
                onClick={onNavigate}
                className={linkClass(location === "/recruiter-history")}
              >
                <History className="size-4" />
                History
              </Link>

            {hasPermission("Add Candidate") && (
              <Link
                href="/recruiter/add"
                onClick={onNavigate}
                className={linkClass(location === "/recruiter/add")}
              >
                <UserPlus className="size-4" />
                Add Candidate
              </Link>
            )}
            <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Containt Management
            </div>
            {hasPermission("Blogs") && (
              <Link
                href="/admin/blog/add"
                onClick={onNavigate}
                className={linkClass(location === "/blog/add")}
              >
                <GraduationCap className="size-4" />
                Blogs
              </Link>
            )}


            {(
              hasPermission("Course Categories") ||
              hasPermission("Course Management") ||
              hasPermission("Learning Paths") ||
              hasPermission("Live Training Sessions")
            ) && (
                <>
                  <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    LMS & Learning Ecosystem
                  </div>

                  {hasPermission("Course Categories") && (
                    <Link
                      href="/recruiter/categories"
                      onClick={onNavigate}
                      className={linkClass(
                        location === "/recruiter/categories"
                      )}
                    >
                      <UserPlus className="size-4" />
                      Course Categories
                    </Link>
                  )}

                  {hasPermission("Course Management") && (
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
                  )}

                  {hasPermission("Learning Paths") && (
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
                  )}

                  {/* {hasPermission("Learning Paths") && ( */}
                    <Link
                      href="/admin-test-assignment"
                      onClick={onNavigate}
                      className={linkClass(
                        location === "/admin-test-assignment" 
                      )}
                    >
                      <UserPlus className="size-4" />
                      Assignment
                    </Link>
                  {/* )} */}

                  {hasPermission("Live Training Sessions") && (
                    <Link
                      href="/recruiter/live-session"
                      onClick={onNavigate}
                      className={linkClass(
                        location === "/recruiter/live-session"
                      )}
                    >
                      <UserPlus className="size-4" />
                      Live Training Sessions
                    </Link>
                  )}
                </>
              )}

            {/* Career Transformation */}
            {hasPermission("Training Pipeline") && (
              <>
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
              </>
            )}

            {/* Platform Section */}
            {(
              hasPermission("Overview") ||
              hasPermission("Data Sources") ||
              hasPermission("Settings")
            ) && (
                <>
                  <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Platform
                  </div>

                  {hasPermission("Overview") && (
                    <Link
                      href="/admin"
                      onClick={onNavigate}
                      className={linkClass(location === "/admin")}
                    >
                      <BarChart3 className="size-4" />
                      Overview
                    </Link>
                  )}

                  {hasPermission("Data Sources") && (
                    <Link
                      href="#"
                      onClick={onNavigate}
                      className={linkClass(
                        location === "/admin/data-sources"
                      )}
                    >
                      <Database className="size-4" />
                      Data Sources
                    </Link>
                  )}

                  {hasPermission("Settings") && (
                    <Link
                      href="#"
                      onClick={onNavigate}
                      className={linkClass(
                        location === "/admin/settings"
                      )}
                    >
                      <Settings className="size-4" />
                      Settings
                    </Link>
                  )}

                </>
              )}

            {/* Role & Permissions */}
            {hasPermission("Permissions") && (
              <>
                <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Role & Permissions
                </div>

                {hasPermission("Permissions") && (
                  <Link
                    href="/admin/permissons"
                    onClick={onNavigate}
                    className={linkClass(
                      location === "/admin/permissons"
                    )}
                  >
                    <GraduationCap className="size-4" />
                    Permissons
                  </Link>
                )}

                <button
                  onClick={() => setShowAddUserModal(true)}
                  // className={linkClass(location === "/admin/users")}
                  className={linkClass(false)}
                >
                  <UserPlus className="size-4" />
                  Add User
                </button>
              </>
            )}
          </>
        )}
      </div>

      <AddUserModal
        open={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={async (data) => {
          console.log("New User:", data);
          setShowAddUserModal(false);
        }}
      />
    </>
  );
}