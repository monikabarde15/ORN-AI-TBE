import {
  Trash2,
  ShoppingCart,
} from "lucide-react";

interface Props {
  courses: any[];
  removeCourse: (
    id: string
  ) => void;
}

export default function SelectedCourses({
  courses,
  removeCourse,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <ShoppingCart size={22} />
          </div>

          <div>
            <p className="text-sm text-orange-100">
              Course Bundle
            </p>

            <h2 className="text-xl font-bold">
              Selected Courses
            </h2>
          </div>

        </div>

      </div>

      {/* Body */}
      <div className="max-h-[350px] overflow-y-auto p-4">

        {courses.length === 0 ? (
          <div className="py-10 text-center">

            <div className="text-5xl">
              📚
            </div>

            <h3 className="mt-4 font-semibold">
              No Course Selected
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add courses from the list
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {courses.map(
              (course: any) => (
                <div
                  key={course._id}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-3
                  "
                >

                  <img
                    src={
                      course.thumbnail ||
                      "https://placehold.co/200x120"
                    }
                    alt={
                      course.title
                    }
                    className="
                      h-16
                      w-24
                      rounded-xl
                      object-cover
                    "
                  />

                  <div className="flex-1">

                    <h4 className="line-clamp-1 text-sm font-semibold">
                      {course.title}
                    </h4>

                    <p className="mt-1 text-green-600 font-semibold">
                      ₹{course.price}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      removeCourse(
                        course._id
                      )
                    }
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-red-50
                      text-red-500
                      hover:bg-red-100
                    "
                  >
                    <Trash2
                      size={16}
                    />
                  </button>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}
