// components/layout/header/MobileHeader.tsx

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Link } from "wouter";

import ornAiLogo from "@assets/logo_1777984164420.jpg";

interface MobileHeaderProps {
  onMenuClick: () => void;
  UserMenu: React.ComponentType<{ compact?: boolean }>;
}

export default function MobileHeader({
  onMenuClick,
  UserMenu,
}: MobileHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`lg:hidden sticky top-0 z-50 h-20 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md border-[#e2e8f0]"
          : "bg-white/90 backdrop-blur-md border-[#e2e8f0]/80"
      }`}
    >
      <div className="relative h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Hamburger Menu Toggle */}
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex items-center justify-center h-11 w-11 rounded-lg text-[#17122A] hover:bg-[#17122A]/5 active:scale-95 transition-all"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Center Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" aria-label="ORN-AI home">
            <img
              src={ornAiLogo}
              alt="ORN-AI"
              className="h-9 sm:h-10 w-auto object-contain rounded-md"
            />
          </Link>
        </div>

        {/* Right User Action */}
        <div className="flex items-center">
          <UserMenu compact />
        </div>
      </div>
    </header>
  );
}
