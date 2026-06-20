import React from "react";

interface TabNavigationProps {
    activeTab: string;
    setActiveTab: (
        tab: "courses" | "sessions"
    ) => void;

    showCourseManager: boolean;
    setShowCourseManager: (
        value: boolean
    ) => void;

    showSessionForm: boolean;
    setShowSessionForm: (
        value: boolean
    ) => void;
}

export default function TabNavigation({
    activeTab,
    setActiveTab,
    showCourseManager,
    setShowCourseManager,

    showSessionForm,
    setShowSessionForm,
}: TabNavigationProps) {
    const showBack = showCourseManager || showSessionForm;
    return (
        <div className="mb-8 flex items-center gap-3">

            {showBack && (
                <button
                    onClick={() => {
                        setShowCourseManager(
                            false
                        );

                        setShowSessionForm(
                            false
                        );
                    }}
                    className="
                rounded-xl
                border
                bg-black
                px-5
                py-3
                font-medium
                shadow-sm
                text-white
            "
                >
                    ← 
                </button>
            )}

            <button
                onClick={() =>
                    setActiveTab("courses")
                }
                className={`rounded-xl px-6 py-3 ${activeTab === "courses"
                        ? "bg-blue-600 text-white"
                        : "border bg-white"
                    }`}
            >
                Courses
            </button>

            <button
                onClick={() =>
                    setActiveTab("sessions")
                }
                className={`rounded-xl px-6 py-3 ${activeTab === "sessions"
                        ? "bg-blue-600 text-white"
                        : "border bg-white"
                    }`}
            >
                Live Sessions
            </button>

        </div>
    );
}