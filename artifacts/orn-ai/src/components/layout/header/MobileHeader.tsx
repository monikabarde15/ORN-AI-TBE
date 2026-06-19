// components/layout/header/MobileHeader.tsx

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
    return (
        <header className="lg:hidden sticky top-0 z-50 h-[72px] border-b bg-background/95 backdrop-blur-md">
            <div className="relative h-full px-4 flex items-center">

                <button
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                    className="flex items-center justify-center h-10 w-10 rounded-md hover:bg-muted"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <div className="absolute left-1/2 -translate-x-1/2">
                    <Link href="/" aria-label="ORN-AI home">
                        <img
                            src={ornAiLogo}
                            alt="ORN-AI"
                            className="h-9 w-auto object-contain rounded-md"
                        />
                    </Link>
                </div>

                <div className="ml-auto flex items-center">
                    <UserMenu compact />
                </div>

            </div>
        </header>
    );
}