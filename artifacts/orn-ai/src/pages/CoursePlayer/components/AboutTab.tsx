import AuthorCard from "./AuthorCard";
import CourseTags from "./CourseTags";
import RelatedCourses from "./RelatedCourses";

interface AboutTabProps {
  course: any;
  relatedCourses: any[];
  categoryName: string;
}

const AboutTab = ({
  course,
  categoryName,
}: AboutTabProps) => {
  return (
    <div className="space-y-10">
      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}
      <section className="overflow-hidden rounded-xl border border-blue-100 bg-white">
        {course?.thumbnail && (
          <div className="bg-black">
            <img
              src={course.thumbnail}
              alt={course?.courseName}
              className="h-[520px] w-full object-cover"
            />
          </div>
        )}

        <div className="px-8 py-8 lg:px-10 lg:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-800">
            Course Overview
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-black lg:text-5xl">
            {course?.title}
          </h1>

          {course?.subtitle && (
            <p className="mt-5 max-w-4xl text-lg leading-8 text-blue-900">
              {course.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ====================================================== */}
      {/* QUICK STATS */}
      {/* ====================================================== */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-blue-100 bg-white p-7 transition hover:border-blue-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-800">
            Modules
          </p>

          <h3 className="mt-4 text-4xl font-bold text-black">
            {course?.totalModules || 0}
          </h3>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-7 transition hover:border-blue-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-800">
            Lessons
          </p>

          <h3 className="mt-4 text-4xl font-bold text-black">
            {course?.totalLessons || 0}
          </h3>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-7 transition hover:border-blue-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-800">
            Videos
          </p>

          <h3 className="mt-4 text-4xl font-bold text-black">
            {course?.totalVideos || 0}
          </h3>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-7 transition hover:border-blue-800">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-800">
            PDFs
          </p>

          <h3 className="mt-4 text-4xl font-bold text-black">
            {course?.totalPdfs || 0}
          </h3>
        </div>
      </section>

      {/* ====================================================== */}
      {/* ABOUT */}
      {/* ====================================================== */}
      <section className="rounded-xl border border-blue-100 bg-white p-8 lg:p-10">
        <div className="max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-800">
            About Course
          </p>

          <h2 className="mt-3 text-3xl font-bold text-black">
            Learn With Confidence
          </h2>

          <p className="mt-6 text-lg leading-9 text-blue-900">
            {course?.description}
          </p>
        </div>
      </section>

      {/* ====================================================== */}
      {/* COURSE DETAILS */}
      {/* ====================================================== */}
      <CourseTags
        course={course}
        categoryName={categoryName}
      />

      {/* ====================================================== */}
      {/* INSTRUCTOR */}
      {/* ====================================================== */}
      {course?.instructor && (
        <AuthorCard instructor={course.instructor} />
      )}

      {/* ====================================================== */}
      {/* RELATED */}
      {/* ====================================================== */}
      <RelatedCourses currentCourseId={course?.id} />
    </div>
  );
};

export default AboutTab;