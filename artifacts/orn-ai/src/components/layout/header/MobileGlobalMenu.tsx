// components/layout/header/MobileGlobalMenu.tsx

import { X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface MobileGlobalMenuProps {
    open: boolean;
    onClose: () => void;
    user: any;
}

export default function MobileGlobalMenu({
    open,
    onClose,
    user,
}: MobileGlobalMenuProps) {
    const [coursesOpen, setCoursesOpen] = useState(false);
    return (
        <>
            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-[70] lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <aside
                className={`
          fixed
          top-0
          left-0
          h-[100dvh]
          w-[85vw] max-w-[320px]
          bg-background
          border-r
          z-[80]
          transform
          transition-transform
          duration-300
          ease-in-out
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
                        aria-label="Close navigation"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto h-[calc(100vh-64px)]">
                    <div className="p-4 space-y-1">

                        {/* Public Links */}
                        {!user && (
                            <>
                                <Link
                                    href="/"
                                    onClick={onClose}
                                    className="block rounded-md px-3 py-3 hover:bg-muted"
                                >
                                    Platform
                                </Link>

                                <button
                                    onClick={() => setCoursesOpen(!coursesOpen)}
                                    className="w-full rounded-md px-3 py-3 hover:bg-muted flex items-center justify-between"
                                >
                                    <span>Courses</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {coursesOpen && (
                                    <div className="ml-4 border-l pl-4 space-y-1 text-sm text-muted-foreground">
                                        <Link
                                            href="/cyber-security"
                                            onClick={onClose}
                                            className="block py-2"
                                        >
                                            Cyber Security
                                        </Link>

                                        <Link
                                            href="/data-science-ai"
                                            onClick={onClose}
                                            className="block py-2"
                                        >
                                            Data Science & AI
                                        </Link>

                                        <Link
                                            href="/advanced-programs"
                                            onClick={onClose}
                                            className="block py-2"
                                        >
                                            Advanced Programs
                                        </Link>

                                        <Link
                                            href="/business-analytics"
                                            onClick={onClose}
                                            className="block py-2"
                                        >
                                            Business Analytics
                                        </Link>

                                        <Link
                                            href="/technology-programs"
                                            onClick={onClose}
                                            className="block py-2"
                                        >
                                            Technology Programs
                                        </Link>

                                        <Link
                                            href="/science-programs"
                                            onClick={onClose}
                                            className="block py-2"
                                        >
                                            Science Programs
                                        </Link>
                                    </div>
                                )}

                                <Link
                                    href="/blogs"
                                    onClick={onClose}
                                    className="block rounded-md px-3 py-3 hover:bg-muted"
                                >
                                    Blogs
                                </Link>

                                <Link
                                    href="/about-us"
                                    onClick={onClose}
                                    className="block rounded-md px-3 py-3 hover:bg-muted"
                                >
                                    About
                                </Link>

                                <Link
                                    href="/contact-us"
                                    onClick={onClose}
                                    className="block rounded-md px-3 py-3 hover:bg-muted"
                                >
                                    Contact
                                </Link>

                                <div className="border-t mt-4 pt-4">
                                    <Link
                                        href="/register"
                                        onClick={onClose}
                                        className="block rounded-md px-3 py-3 bg-primary text-primary-foreground text-center"
                                    >
                                        Join Talent Pool
                                    </Link>
                                </div>
                            </>
                        )}

                        {/* Candidate Global Nav */}
                        {user?.role === "candidate" && (
                            <>
                                <Link
                                    href="#"
                                    onClick={onClose}
                                    className="block rounded-md px-3 py-3 hover:bg-muted"
                                >
                                    Feed
                                </Link>

                                <Link
                                    href="#"
                                    onClick={onClose}
                                    className="block rounded-md px-3 py-3 hover:bg-muted"
                                >
                                    Workshops
                                </Link>

                                <Link
                                    href="/courses"
                                    onClick={onClose}
                                    className="block rounded-md px-3 py-3 hover:bg-muted"
                                >
                                    Courses
                                </Link>

                                <Link
                                    href="#"
                                    onClick={onClose}
                                    className="block rounded-md px-3 py-3 hover:bg-muted"
                                >
                                    Messages
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}