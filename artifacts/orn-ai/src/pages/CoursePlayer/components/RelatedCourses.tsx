const relatedCourses = [
  {
    id: 1,
    title: "Advanced React Development",
    category: "Frontend",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200",
  },
  {
    id: 2,
    title: "Node.js Backend Mastery",
    category: "Backend",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
  },
  {
    id: 3,
    title: "AI Engineering Fundamentals",
    category: "Artificial Intelligence",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
  },
];

const RelatedCourses = () => {
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
        {relatedCourses.map((course) => (
          <div
            key={course.id}
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
                src={course.image}
                alt={course.title}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            </div>

            <div className="p-4">
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
                {course.category}
              </span>

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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedCourses;