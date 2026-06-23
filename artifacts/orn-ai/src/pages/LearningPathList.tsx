// artifacts\orn-ai\src\pages\LearningPathList.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Search, ShoppingCart, Trash2, CreditCard,
  Layers, PlayCircle, ClipboardList
} from "lucide-react";
import {
  Link,
  Copy
} from "lucide-react";
import api from "../../services/api";
import { Shell } from "@/components/layout/Shell";
import {
  BookOpen,

} from "lucide-react";
import { toast } from "sonner";
interface LearningPath {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  introVideo?: string;
  paymentLink?: string | null;
  courseIds?: string[];
  courses?: any[];
  createdAt?: string;
}
export default function LearningPathList() {
  const [editingId, setEditingId] = useState<string | null>(null);
  // const [sessionTitle, setSessionTitle] =useState("");
  const [search, setSearch] = useState("");
  // const [trainerName, setTrainerName] =useState("");
  // const [meetingLink, setMeetingLink] =useState("");
  // const [sessionDate, setSessionDate] =useState("");
  // const [startTime, setStartTime] =useState("");
  // const [students, setStudents] =useState<any[]>([]);
  // const [selectedStudent, setSelectedStudent] =useState<any>(null);
  // const [endTime, setEndTime] =useState("");
  const [courses, setCourses] = useState<LearningPath[]>([]);
  // const [description, setDescription] =useState("");
  // const [creating, setCreating] =useState(false);
  // const [openModal, setOpenModal] =useState(false);
  // const [selectedCourse, setSelectedCourse] =useState<any>(null);
  // const [sessions, setSessions] =useState([]);
  const [loading, setLoading] = useState(true);
  const [enabledPaths, setEnabledPaths] = useState<Record<string, boolean>>({});

  const editLearningPath = (
    path: any
  ) => {
    window.location.href =
      `/recruiter/learning-path-manage/${path.id}`;
  };
  const [paths, setPaths] =
    useState<any[]>([]);

  useEffect(() => {
    loadLearningPaths();
  }, []);

  const loadLearningPaths =
    async () => {
      try {
        const res =
          await api.get(
            "/api/learning-paths"
          );

        setPaths(
          res.data.data || []
        );
        setCourses(
          res.data?.data || []
        );
        const statusMap: Record<string, boolean> = {};

      (res.data.data || []).forEach((path: any) => {
        statusMap[path.id] = path.isEnabled ?? true;
      });

      setEnabledPaths(statusMap);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  const filteredCourses = useMemo(
    () => courses.filter(c => c.title?.toLowerCase().includes(search.toLowerCase())),
    [courses, search]
  );

  const deleteLearningPath = async (
    id: string
  ) => {
    try {
      await api.delete(
        `/api/learning-paths/${id}`
      );

      setPaths((prev) =>
        prev.filter(
          (path) => path.id !== id
        )
      );

      toast.success(
        "Learning Path Deleted"
      );

    } catch (error) {
      console.error(error);

      toast.error(
        "Delete failed"
      );
    }
  };

  // Learning Path toggle
const toggleLearningPathStatus = async (
  pathId: string
) => {
  try {
    const currentStatus =
      enabledPaths[pathId];

    await api.patch(
      `/api/learning-paths/${pathId}/toggle-status`,
      {
        isEnabled: !currentStatus,
      }
    );

    setEnabledPaths((prev) => ({
      ...prev,
      [pathId]: !currentStatus,
    }));

    toast.success(
      !currentStatus
        ? "Learning Path Enabled"
        : "Learning Path Disabled"
    );
  } catch (error: any) {
    console.error(error);

    toast.error(
      error?.response?.data?.error ||
      "Failed to update status"
    );
  }
};
  
  return (
    <Shell>
      <div className="p-6">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold">
              Learning Paths
            </h1>

            <p className="text-slate-500">
              Manage all learning paths
            </p>
          </div>


          <div className="rounded-2xl bg-blue-100 px-4 py-2 font-semibold text-blue-700">
            {paths.length} Paths
          </div>
          <a
            href="/recruiter/learning-path"
            className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            bg-blue-600
            px-3
            py-2
            text-sm
            font-medium
            text-white
          "
          >
            📚 Learning Paths
          </a>

        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map(
              (_, i) => (
                <div
                  key={i}
                  className="h-[320px] animate-pulse rounded-3xl bg-slate-200"
                />
              )
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {paths.map((path) => (
              <div
                key={path.id}
                className="
                  overflow-hidden
                  rounded-[28px]
                  border
                  bg-white
                  shadow-sm
                  transition-all
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                <img
                  src={
                    path.thumbnail ||
                    "https://placehold.co/600x400"
                  }
                  alt=""
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">

                  <h3 className="text-xl font-bold">
                    {path.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                    {path.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <BookOpen size={16} />
                    {path.courses?.length || 0} &nbsp;
                    Courses
                  </div>

                  <div className="mt-5 flex gap-3">

                    {/* Toggle */}


                    <button
                      onClick={() =>
                        toggleLearningPathStatus(
                          path.id
                        )
                      }
                      className={`relative h-9 w-20
    rounded-full
    transition-all

    ${enabledPaths[path.id]
                          ? "bg-emerald-500"
                          : "bg-slate-300"
                        }
  `}
                    >
                      <div
                        className={`
      absolute
      top-1
      h-7
      w-7
      rounded-full
      bg-white
      shadow-sm
      transition-all

      ${enabledPaths[path.id]
                            ? "left-12"
                            : "left-1"
                          }
    `}
                      />

                      <span
                        className="
      text-xs
      font-semibold
      text-white
    "
                      >
                        {enabledPaths[path.id]
                          ? "Enable"
                          : "Disable"}
                      </span>
                    </button>


                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          editLearningPath(path)
                        }
                        className="rounded-xl bg-amber-500 px-4 py-2 text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteLearningPath(
                            path.id
                          )
                        }
                        className="rounded-xl bg-red-600 px-4 py-2 text-white"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    
    </Shell>
  );
}
