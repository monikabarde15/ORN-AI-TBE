import {Trash2,ShoppingCart,} from "lucide-react";
import { useState } from "react";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);


  // Confirm Delete Handler

  const handleConfirmDelete = () => {
    if (!selectedCourse) return;

    removeCourse(
      selectedCourse.id || selectedCourse._id
    );

    setDeleteModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <>
    <div className="overflow-hidden border border-slate-200 bg-white">

      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
            <ShoppingCart size={22} />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Course Bundle
            </p>

            <h2 className="text-lg font-semibold text-slate-900">
              Selected Courses
            </h2>
          </div>

        </div>

      </div>

      {/* Body */}
      <div className="max-h-[350px] overflow-y-auto p-4">

        {courses.length === 0 ? (
          <div className="py-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
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
                  key={course.id || course._id}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
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

                    <p className="mt-1 font-semibold text-blue-900">
                      ₹{course.price}
                    </p>

                  </div>

                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setDeleteModalOpen(true);
                    }}
                    className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            text-slate-500
                            transition
                            hover:bg-slate-50
                            hover:text-red-600
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
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Remove Course?"
        description={
          selectedCourse
            ? `"${selectedCourse.title}" will be removed from this learning path.`
            : "This course will be removed from the learning path."
        }
        confirmText="Remove Course"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
