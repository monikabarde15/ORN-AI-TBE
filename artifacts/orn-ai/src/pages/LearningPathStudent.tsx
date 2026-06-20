// artifacts\orn-ai\src\pages\LearningPathStudent.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  BookOpen,
  Users,
  PlayCircle,
  Calendar,
  X,
} from "lucide-react";
import api from "../../services/api";
import { Shell } from "@/components/layout/Shell";

export default function StudentLearningPaths() {
  const [search, setSearch] = useState("");

  const [selectedPath, setSelectedPath] =
    useState<any>(null);

  const [selectedCourse, setSelectedCourse] =
    useState<any>(null);

  const [courseModal, setCourseModal] =
    useState(false);

  const [courseDetailsModal, setCourseDetailsModal] =
    useState(false);

  const [sessionModal, setSessionModal] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 4;

  const [
  learningPaths,
  setLearningPaths,
] = useState<any[]>([]);
useEffect(() => {
  loadLearningPaths();
}, []);

const loadLearningPaths =
  async () => {
    const res =
      await api.get(
        "/api/student/learning-paths"
      );

    setLearningPaths(
      res.data.data || []
    );
  };
  const filtered = useMemo(() => {
  return learningPaths
    .filter(
      (lp) =>
        lp.sessions?.length > 0
    )
    .filter((lp) =>
      lp.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
}, [learningPaths, search]);

  const totalPages = Math.ceil(
    filtered.length / itemsPerPage
  );

  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
useEffect(() => {
  console.log(
    "LEARNING PATHS",
    learningPaths
  );
}, [learningPaths]);
  return (
    <Shell>
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Stats */}

        <div className="mb-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-6">
            <h4 className="text-sm text-slate-500">
              Learning Paths
            </h4>

            <p className="mt-2 text-4xl font-bold">
              {learningPaths.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6">
            <h4 className="text-sm text-slate-500">
              Courses
            </h4>

            <p className="mt-2 text-4xl font-bold">
              {learningPaths.reduce(
                (a, b) => a + b.courses.length,
                0
              )}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6">
            <h4 className="text-sm text-slate-500">
              Sessions
            </h4>

            <p className="mt-2 text-4xl font-bold">
              {learningPaths.reduce(
                (a, b) => a + b.sessions.length,
                0
              )}
            </p>
          </div>

        </div>

        {/* Search */}

        <div className="relative mb-8">
          <Search
            size={18}
            className="absolute left-3 top-4"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search Learning Path..."
            className="w-full rounded-2xl border bg-white py-3 pl-10"
          />
        </div>

        {/* Cards */}

        <div className="grid gap-6 md:grid-cols-2">

          {paginatedData.map((path) => (

            <div
              key={path.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm"
            >

              <img
                src={path.image}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold">
                  {path.title}
                </h2>

                <p className="mt-2 text-slate-500">
                  {path.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm">
                    {path.courses.length} Courses
                  </span>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-sm">
                    {path.sessions.length} Sessions
                  </span>

                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Users size={16} />
                  {path.trainerName}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">

                  <button
                    onClick={() => {
                      setSelectedPath(path);
                      setCourseModal(true);
                    }}
                    className="rounded-xl border px-4 py-2"
                  >
                    View Courses
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPath(path);
                      setSessionModal(true);
                    }}
                    className="rounded-xl border px-4 py-2"
                  >
                    View Sessions
                  </button>

                  <button
                    onClick={() =>
                      window.open(
                        path.introVideo,
                        "_blank"
                      )
                    }
                    className="rounded-xl bg-blue-600 px-4 py-2 text-white"
                  >
                    Watch Intro
                  </button>

                </div>

              </div>

            </div>

          ))}
        </div>

        {/* Pagination */}

        <div className="mt-8 flex justify-center gap-2">

          {Array.from(
            { length: totalPages },
            (_, i) => (
              <button
                key={i}
                onClick={() =>
                  setCurrentPage(i + 1)
                }
                className={`h-10 w-10 rounded-xl ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border"
                }`}
              >
                {i + 1}
              </button>
            )
          )}

        </div>

      </div>

      {/* Courses Modal */}

      {courseModal && selectedPath && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-2xl rounded-3xl bg-white p-6">

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Courses
              </h2>

              <X
                className="cursor-pointer"
                onClick={() =>
                  setCourseModal(false)
                }
              />
            </div>

            {selectedPath.courses.map(
              (course: any) => (
                <div
                  key={course.id}
                  className="mb-3 flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <h4 className="font-semibold">
                      {course.title}
                    </h4>

                    <p className="text-sm text-slate-500">
                      {course.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setCourseDetailsModal(true);
                    }}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-white"
                  >
                    View
                  </button>

                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Course Details Modal */}

      {courseDetailsModal &&
        selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-2xl rounded-3xl bg-white p-6">

              <div className="mb-4 flex items-center justify-between">

                <h2 className="text-2xl font-bold">
                  Course Details
                </h2>

                <X
                  className="cursor-pointer"
                  onClick={() =>
                    setCourseDetailsModal(false)
                  }
                />

              </div>

              <img
                src={selectedCourse.thumbnail}
                className="h-56 w-full rounded-2xl object-cover"
              />

              <h3 className="mt-4 text-2xl font-bold">
                {selectedCourse.title}
              </h3>

              <p className="mt-2 text-slate-500">
                {selectedCourse.description}
              </p>

              <a
              href={`/course/details/${selectedCourse.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-6
                inline-flex
                rounded-xl
                bg-blue-600
                px-5
                py-3
                text-white
              "
            >
              Watch Course
            </a>

            </div>

          </div>
        )}

      {/* Sessions Modal */}

      {sessionModal && selectedPath && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-2xl rounded-3xl bg-white p-6">

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                Live Sessions
              </h2>

              <X
                className="cursor-pointer"
                onClick={() =>
                  setSessionModal(false)
                }
              />

            </div>

            {selectedPath.sessions.map(
              (session: any) => (
                <div
                  key={session.id}
                  className="mb-4 rounded-2xl border p-4"
                >
                  <h3 className="font-bold">
                    {session.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <Calendar size={16} />
                    {session.date}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <PlayCircle size={16} />
                    {session.time}
                  </div>

                  <button
                    onClick={() =>
                      window.open(
                        session.link,
                        "_blank"
                      )
                    }
                    className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-white"
                  >
                    Join Session
                  </button>
                </div>
              )
            )}

          </div>

        </div>
      )}
    </div>
    </Shell>
  );
}