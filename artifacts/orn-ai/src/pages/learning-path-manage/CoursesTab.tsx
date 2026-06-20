import CourseCard from "../learning-path/CourseCard";

interface CoursesTabProps {
    selectedCourses: any[];
    setShowCourseManager: (
        value: boolean
    ) => void;
}

export default function CoursesTab({
    selectedCourses,
    setShowCourseManager,
}: CoursesTabProps) {
    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        Assigned Courses
                    </h2>

                    <p className="text-sm text-slate-500">
                        Courses assigned to this learning path
                    </p>
                </div>

                <button
                    onClick={() =>
                        setShowCourseManager(true)
                    }
                    className="rounded-xl bg-blue-600 px-5 py-3 text-white"
                >
                    Add More Courses
                </button>
            </div>

            {selectedCourses.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">
                    No courses assigned yet
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {selectedCourses.map(
                        (course: any) => (
                            <CourseCard
                                key={
                                    course.id ||
                                    course._id
                                }
                                course={course}
                                selected={true}
                                onToggle={() => { }}
                            />
                        )
                    )}

                </div>
            )}

        </div>
    );
}