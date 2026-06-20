import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

import api from "../../../../services/api";

const RelatedCourses = ({
  currentCourseId,
}: {
  currentCourseId: string;
}) => {
    const { user } = useAuth();
 const isStudent =
    user?.role === "candidate";
  const [courses, setCourses] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);
const getCourseId = (course: any) =>
  String(
    course.courseId ||
    course.id ||
    course._id ||
    ""
  ).trim();
  useEffect(() => {
    fetchRelatedCourses();
  }, [currentCourseId]);

 const fetchRelatedCourses = async () => {
  try {
    setLoading(true);

    let allCourses: any[] = [];

    if (user?.role === "candidate") {
      const res = await api.get("/api/student/my-learning");

      allCourses =
        res.data?.data?.flatMap(
          (item: any) => item.courses || []
        ) || [];
    } else {
      const res = await api.get("/api/courses");

      allCourses = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
    }

    const coursesWithCategory = await Promise.all(
      allCourses.map(async (course: any) => {
        const normalizedId = getCourseId(course);

        let categoryName = "";

        try {
          if (
            course.category &&
            course.category !== "" &&
            course.category !== null
          ) {
            const categoryRes = await api.get(
              `/api/course-category/${course.category}`
            );

            categoryName =
              categoryRes.data?.data?.name || "";
          }
        } catch (err) {
          console.warn(
            `Category fetch failed for ${normalizedId}`
          );
        }

        return {
          ...course,
          courseId: normalizedId,
          categoryName,
        };
      })
    );
   

   const uniqueCourses = Array.from(
  new Map(
    coursesWithCategory.map((course) => [
      String(course.courseId).trim(),
      course,
    ])
  ).values()
);

const filteredCourses = uniqueCourses.filter(
  (course: any) =>
    String(course.courseId).trim() !==
    String(currentCourseId).trim()
);

    console.log(
      "Current Course:",
      currentCourseId
    );

    console.table(
      filteredCourses.map((c) => ({
        title: c.title,
        courseId: c.courseId,
      }))
    );

    setCourses(filteredCourses);
  } catch (error) {
    console.error(
      "Related Courses Error:",
      error
    );
  } finally {
    setLoading(false);
  }
};

  if (loading) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      Loading courses...
    </div>
  );
}

if (courses.length === 0) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      No related courses found
    </div>
  );
}

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Related Courses
        </h2>

        <p className="mt-2 text-gray-500">
          Explore more courses that may interest you.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        
        {courses.map(
          (course: any) => (
            <div
              key={course.courseId}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                transition-all
                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={
                    course.thumbnail
                  }
                  alt={
                    course.title
                  }
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              </div>

              <div className="p-4">
                {course?.categoryName?.trim() && (
                    <span
                      className="
                        inline-flex
                        rounded-full
                        bg-red-50
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-red-600
                      "
                    >
                      {course.categoryName}
                    </span>
                  )}

                <h3
                  className="
                    mt-3
                    line-clamp-2
                    text-lg
                    font-semibold
                    text-gray-900
                  "
                >
                  {course.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  ₹{course.price}
                </p>

                <Link
                  href={`/course/details/${course.courseId}`}
                >
                  <button
                    className="
                      mt-4
                      w-full
                      rounded-xl
                      bg-gray-900
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-black
                    "
                  >
                    View Course
                  </button>
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RelatedCourses;