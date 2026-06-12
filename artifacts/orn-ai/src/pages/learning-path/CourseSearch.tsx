import {
  Search,
  BookOpen,
} from "lucide-react";

interface Props {
  search: string;
  setSearch: (
    value: string
  ) => void;
}

export default function CourseSearch({
  search,
  setSearch,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

      <div className="border-b bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <BookOpen size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Select Courses
            </h2>

            <p className="text-sm text-blue-100">
              Search and add courses
            </p>
          </div>

        </div>

      </div>

      <div className="p-5">

        <div className="relative">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search courses..."
            className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              py-4
              pl-12
              pr-4
              outline-none
              transition-all
              focus:border-blue-500
              focus:bg-white
              focus:ring-4
              focus:ring-blue-100
            "
          />

        </div>

      </div>

    </div>
  );
}

