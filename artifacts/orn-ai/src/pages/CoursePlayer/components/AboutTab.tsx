import AuthorCard from "./AuthorCard";
import CourseTags from "./CourseTags";
import RelatedCourses from "./RelatedCourses";
interface AboutTabProps {
  course: any;
  relatedCourses: any[];
}

const AboutTab = ({
  course,
}: AboutTabProps) => {
  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        {course?.thumbnail && (
          <div className="h-[300px] overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course?.courseName}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <p className="mb-2 text-sm font-medium text-red-500 uppercase tracking-wide">
            Course Overview
          </p>

          <h1 className="text-4xl font-bold text-gray-900">
            {course?.courseName}
          </h1>

          {course?.subtitle && (
            <p className="mt-4 text-lg text-gray-600">
              {course.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">
          About This Course
        </h2>

        <p className="leading-8 text-gray-600">
          {course?.courseDescription ||
            "Course description is not available."}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Modules
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {course?.totalModules || 0}
          </h3>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Lessons
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {course?.totalLessons || 0}
          </h3>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Videos
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {course?.totalVideos || 0}
          </h3>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            PDFs
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {course?.totalPdfs || 0}
          </h3>
        </div>
      </div>

      {/* Tags */}
      <CourseTags course={course} />

      {/* Instructor */}
      {course?.instructor && (
        <AuthorCard
          instructor={course.instructor}
        />
      )}

      {/* Related Courses */}
      <RelatedCourses currentCourseId={course?.id}/>
    </div>
  );
};

export default AboutTab;