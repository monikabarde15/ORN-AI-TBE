import CourseCard from "./CourseCard";

interface Props {
  courses: any[];
  selectedCourses: any[];
  toggleCourse: (
    course: any
  ) => void;
  loading?: boolean;
}

export default function CourseGrid({
  courses,
  selectedCourses,
  toggleCourse,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {[...Array(6)].map(
          (_, index) => (
            <div
              key={index}
              className="h-[320px] animate-pulse rounded-[28px] bg-slate-200"
            />
          )
        )}

      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-[32px] border border-dashed border-slate-300 bg-white py-16 text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          📚
        </div>

        <h3 className="mt-5 text-xl font-bold">
          No Courses Found
        </h3>

        <p className="mt-2 text-slate-500">
          Try another search keyword
        </p>

      </div>
    );
  }

  return (
    <div>

      <div className="mb-5 flex items-center justify-between">

        <h3 className="text-xl font-bold">
          Available Courses
        </h3>

        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          {courses.length} Courses
        </span>

      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {courses.map(
          (course: any) => (
            <CourseCard
              key={course._id}
              course={course}
              selected={selectedCourses.some(
                (c: any) =>
                  c._id ===
                  course._id
              )}
              onToggle={() =>
                toggleCourse(
                  course
                )
              }
            />
          )
        )}

      </div>

    </div>
  );
}
