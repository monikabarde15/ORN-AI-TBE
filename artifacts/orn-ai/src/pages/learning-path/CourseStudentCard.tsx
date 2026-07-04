// artifacts\orn-ai\src\pages\learning-path\CourseCard.tsx
import {
  CheckCircle2,
  Plus,
  PlayCircle,
  BookOpen,
  ClipboardList,
} from "lucide-react";

interface Props {
  course: any;
  selected: boolean;
  onToggle: () => void;
}

export default function CourseStudentCard({
  course,
  selected,
  onToggle,
}: Props) {
  return (
    <div
      className={`
        group
        overflow-hidden
        rounded-[28px]
        border
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl

        ${
          selected
            ? "border-blue-900 ring-4 ring-blue-100"
            : "border-slate-200"
        }
      `}
      onClick={() =>
                window.open(
                  `/course/details/${course.id}`,
                  "_blank"
                )
              }
    >
      {/* Thumbnail */}

      <div className="relative h-48 overflow-hidden">

        <img
          src={
            course.thumbnail ||
            "https://placehold.co/600x400"
          }
          alt={course.title}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {selected && (
          <div className="absolute right-3 top-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-white shadow-lg">

              <CheckCircle2
                size={20}
              />

            </div>

          </div>
        )}

      </div>

      {/* Content */}

      <div className="p-5">

        <h3 className="line-clamp-2 min-h-[56px] text-lg font-bold text-slate-800">
          {course.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
          {course.description ||
            "No description available"}
        </p>

        {/* Stats */}

        <div className="mt-4 flex flex-wrap gap-2">

          <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-900">
            <BookOpen size={12} />
            {course.lessonCount || 0}
            Lessons
          </span>

          <span className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
            <PlayCircle size={12} />
            {course.videoCount || 0}
            Videos
          </span>

          <span className="flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600">
            <ClipboardList size={12} />
            {course.quizCount || 0}
            Quizzes
          </span>

        </div>

       
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={() =>
                window.open(
                  `/course/details/${course.id}`,
                  "_blank"
                )
              }
              className="rounded-xl border border-blue-900 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50"
            >
              Preview
            </button>

            <button
              onClick={onToggle}
              className={`rounded-xl py-2 text-sm font-semibold transition ${
                selected
                  ? "bg-blue-100 text-blue-900"
                  : "bg-blue-900 text-white hover:bg-blue-900"
              }`}
            >
              {selected ? "Added" : "Add"}
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}