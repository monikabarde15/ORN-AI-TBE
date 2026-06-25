import React, { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Video,
  Search,
} from "lucide-react";

import { toast } from "sonner";
import api from "../../services/api";
import { Shell } from "@/components/layout/Shell";
import { useAuth } from "@/hooks/use-auth";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

interface Session {
  id: string;
  sessionTitle: string;
  trainerName: string;
  meetingLink: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  description: string;
  status: string;

  studentName: string;
  studentEmail: string;
  studentPhone: string;

  learningPath?: {
    id: string;
    title: string;
    description: string;
    image: string;
    paymentLink?: string;
    introVideo?: string;
    courseIds?: string[];
  };
}

export default function LiveSessionsDashboard() {
   const { user } = useAuth();
  
    const [permissions, setPermissions] = useState([]);
  
  useEffect(() => {
    if (!user?.id) return;
  
    api
      .get(`/api/user-permissions/${user.id}`)
      .then((res) => {
        setPermissions(res.data.permissions || []);
      });
  }, [user?.id]);
  
  const hasPermission = (
    moduleName: string,
    action = "canView"
  ) => {
    if (user?.role === "admin") return true;
  
    return permissions.some(
      (p: any) =>
        p.moduleName === moduleName &&
        p[action]
    );
  };
  
    
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const itemsPerPage = 8;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [search, setSearch] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSessionForDelete, setSelectedSessionForDelete] = useState<Session | null>(null);

  const loadSessions = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/api/live-sessions"
      );

      setSessions(
        res.data?.data || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load sessions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const deleteSession = async (
    id: string
  ) => {
    try {
      await api.delete(
        `/api/live-sessions/${id}`
      );

      toast.success(
        "Session deleted"
      );

      loadSessions();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete session"
      );
    }
  };

  // Confirm Delete Handler

  const handleConfirmDelete = async () => {
    if (!selectedSessionForDelete) return;

    await deleteSession(
      selectedSessionForDelete.id
    );

    setDeleteModalOpen(false);
    setSelectedSessionForDelete(null);
  };

  const filteredSessions =
    useMemo(() => {
      return sessions.filter(
        (item) =>
          item.sessionTitle
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.learningPath?.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.studentName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [sessions, search]);
  const totalPages = Math.ceil(
    filteredSessions.length /
    itemsPerPage
  );

  const paginatedSessions =
    filteredSessions.slice(
      (currentPage - 1) *
      itemsPerPage,
      currentPage *
      itemsPerPage
    );
  const upcomingSessions =
    sessions.filter(
      (s) =>
        s.status === "scheduled"
    ).length;

  const completedSessions =
    sessions.filter(
      (s) =>
        s.status === "completed"
    ).length;

  return (
    <Shell>
      <div className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8">

            <h1 className="text-4xl font-bold">
              Live Sessions Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              Manage all live
              training sessions,
              students and
              learning paths
            </p>

          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Sessions
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {sessions.length}
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Upcoming
              </p>

              <h2 className="mt-2 text-4xl font-bold text-blue-600">
                {upcomingSessions}
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <h2 className="mt-2 text-4xl font-bold text-green-600">
                {completedSessions}
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Learning Paths
              </p>

              <h2 className="mt-2 text-4xl font-bold text-purple-600">
                {
                  new Set(
                    sessions.map(
                      (s) =>
                        s
                          .learningPath
                          ?.id
                    )
                  ).size
                }
              </h2>
            </div>

          </div>

          {/* Search */}
          <div className="mb-8">

            <div className="relative">

              <Search
                className="
                absolute
                left-4
                top-1/2
                h-5
                w-5
                -translate-y-1/2
                text-slate-400
              "
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search sessions..."
                className="
                  w-full
                  rounded-2xl
                  border
                  bg-white
                  py-4
                  pl-12
                  pr-4
                  outline-none
                "
              />

            </div>

          </div>

          {/* Loading */}
          {loading && (
            <div className="py-20 text-center">
              Loading...
            </div>
          )}

          {/* Cards */}
          {!loading && (
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">

              {paginatedSessions.map(
                (session) => (
                  <div
                    key={session.id}
                    className="
                    overflow-hidden
                    rounded-3xl
                    bg-white
                    shadow-sm
                    transition-all
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                  >

                    {/* Image */}
                    <img
                      src={
                        session
                          .learningPath
                          ?.image ||
                        "https://placehold.co/600x400"
                      }
                      className="
                      h-32
                      w-full
                      object-cover
                    "
                    />

                    <div className="p-3">
                      <div className="mb-3">

                        <h2 className="truncate text-sm font-semibold">
                          {
                            session.learningPath
                              ?.title
                          }
                        </h2>

                        <p className="
    mt-1
    line-clamp-2
    text-xs
    text-slate-500
  ">
                          {
                            session.learningPath
                              ?.description
                          }
                        </p>

                      </div>
                      {/* Learning Path */}
                      <div className="rounded-xl bg-slate-50 p-3">

                        <div className="flex items-center gap-2">
                          <Video size={16} />

                          <span className="text-xs font-semibold">
                            Session
                          </span>
                        </div>

                        <h3 className="mt-2 truncate text-sm font-semibold">
                          {session.sessionTitle}
                        </h3>

                        <div className="mt-2 space-y-1 text-xs text-slate-500">

                          <p>
                            👨‍🏫 {session.trainerName || "-"}
                          </p>

                          <p>
                            📅 {session.sessionDate || "-"}
                          </p>

                          <p>
                            ⏰ {session.startTime}
                            {" - "}
                            {session.endTime}
                          </p>

                        </div>

                      </div>


                      {/* Buttons */}
                      <div className="mt-3 flex gap-2">

                        <button
                          onClick={() => {
                            setSelectedSession(
                              session
                            );

                            setViewModal(true);
                          }}
                          className="
                            flex-1
                            rounded-lg
                            border
                            px-3
                            py-2
                            text-xs
                            font-medium
                          "
                        >
                          View
                        </button>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              session.meetingLink
                            );

                            toast.success("Copied");
                          }}
                          className="
                            rounded-lg
                            bg-blue-600
                            px-3
                            py-2
                            text-xs
                            text-white
                          "
                        >
                          Copy
                        </button>

                       {hasPermission(
                        "Live Training Sessions",
                        "canDelete"
                      ) && (
                          <button
                            onClick={() => {
                              setSelectedSessionForDelete(session);
                              setDeleteModalOpen(true);
                            }}
                            className="
    rounded-lg
    bg-red-600
    px-3
    py-2
    text-xs
    text-white
  "
                          >
                            Delete
                          </button>
                      )}

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}
          <div className="mt-6 flex justify-center gap-2">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (p) => p - 1
                )
              }
              className="
                  rounded-lg
                  border
                  px-3
                  py-2
                  text-sm
                "
            >
              Prev
            </button>

            {Array.from(
              { length: totalPages },
              (_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setCurrentPage(i + 1)
                  }
                  className={`
                      h-8
                      w-8
                      rounded-lg
                      text-sm
                      ${currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "border"
                    }
                    `}
                >
                  {i + 1}
                </button>
              )
            )}

            <button
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (p) => p + 1
                )
              }
              className="
                  rounded-lg
                  border
                  px-3
                  py-2
                  text-sm
                "
            >
              Next
            </button>

          </div>
          {viewModal &&
            selectedSession && (

              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                <div className="w-full max-w-2xl rounded-3xl bg-white p-6">

                  <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-xl font-bold">
                      Session Details
                    </h2>

                    <button
                      onClick={() =>
                        setViewModal(false)
                      }
                      className="text-xl"
                    >
                      ✕
                    </button>

                  </div>

                  <img
                    src={
                      selectedSession
                        .learningPath?.image ||
                      "https://placehold.co/600x300"
                    }
                    className="
          h-48
          w-full
          rounded-2xl
          object-cover
        "
                  />

                  <h3 className="mt-4 text-xl font-bold">
                    {
                      selectedSession
                        .learningPath?.title
                    }
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {
                      selectedSession
                        .learningPath
                        ?.description
                    }
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">

                    <div className="rounded-xl bg-slate-50 p-4">

                      <h4 className="font-semibold">
                        Session Info
                      </h4>

                      <p className="mt-2">
                        <b>Title:</b>{" "}
                        {
                          selectedSession.sessionTitle
                        }
                      </p>

                      <p>
                        <b>Trainer:</b>{" "}
                        {
                          selectedSession.trainerName
                        }
                      </p>

                      <p>
                        <b>Date:</b>{" "}
                        {
                          selectedSession.sessionDate
                        }
                      </p>

                      <p>
                        <b>Time:</b>{" "}
                        {
                          selectedSession.startTime
                        }
                        {" - "}
                        {
                          selectedSession.endTime
                        }
                      </p>

                      <p className="mt-2">
                        {
                          selectedSession.description
                        }
                      </p>

                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">

                      <h4 className="font-semibold">
                        Student Details
                      </h4>

                      <p className="mt-2">
                        {
                          selectedSession.studentName ||
                          "-"
                        }
                      </p>

                      <p>
                        {
                          selectedSession.studentEmail ||
                          "-"
                        }
                      </p>

                      <p>
                        {
                          selectedSession.studentPhone ||
                          "-"
                        }
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            )}
        </div>

      </div>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Session?"
        description={
          selectedSessionForDelete
            ? `"${selectedSessionForDelete.sessionTitle}" will be permanently deleted. This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmText="Delete Session"
        onConfirm={handleConfirmDelete}
      />
    </Shell>
  );
}