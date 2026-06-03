interface CourseTagsProps {
  course: any;
}

const CourseTags = ({
  course,
}: CourseTagsProps) => {
  const tags = [
    {
      label: "Category",
      value: course?.category,
      className:
        "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      label: "Status",
      value: course?.status,
      className:
        "bg-green-50 text-green-700 border-green-100",
    },
    {
      label: "Difficulty",
      value:
        course?.difficulty || "Beginner",
      className:
        "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      label: "Price",
      value: course?.price
        ? `₹${course.price}`
        : "Free",
      className:
        "bg-orange-50 text-orange-700 border-orange-100",
    },
  ].filter(
    (tag) =>
      tag.value !== undefined &&
      tag.value !== null &&
      tag.value !== ""
  );

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">
        Course Details
      </h2>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <div
            key={tag.label}
            className={`
              px-4
              py-2
              rounded-full
              border
              text-sm
              font-medium
              ${tag.className}
            `}
          >
            <span className="font-semibold">
              {tag.label}:
            </span>{" "}
            {tag.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseTags;