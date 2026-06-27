
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
console.log('user=',user);
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
            {user.fullName?.split(" ")[0]}s
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

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <DashboardHeader
              user={user}
              UserMenu={UserMenu}
            />
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

