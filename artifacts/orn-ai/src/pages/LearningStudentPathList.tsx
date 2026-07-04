// artifacts\orn-ai\src\pages\LearningPathList.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

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
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
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
  
    
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [enabledPaths, setEnabledPaths] = useState<Record<string, boolean>>({});

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const editLearningPath = (
    path: any
  ) => {
    window.location.href =
      `/recruiter/learning-path-manage-view/${path.id}`;
  };
  const [paths, setPaths] = useState<any[]>([]);

  useEffect(() => {
    loadLearningPaths();
  }, []);

  const loadLearningPaths =
    async () => {
      try {
        const res =
          await api.get(
            "/api/student/learning-pathsnew"
          );
          console.log("API Response =>", res.data);
console.log("Data Length =>", res.data.data.length);

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

// Delete handler for Modal
const handleConfirmDelete = async () => {
  if (!selectedPath) return;

  await deleteLearningPath(selectedPath.id);

  setDeleteModalOpen(false);
  setSelectedPath(null);
};
  
  return (
    <Shell>
      <div className="p-6">

        <div className="mb-10 flex items-start justify-between">

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Learning Paths
            </h1>

            <p className="mt-0 text-sm text-slate-500">
              Manage all learning paths
            </p>
          </div>


          <div className="flex items-center gap-3">

            <div className="inline-flex items-center rounded-xl bg-blue-100 px-4 py-2 text-md font-semibold text-slate-700">
              {paths.length} Paths
            </div>

            {hasPermission("Learning Paths", "canAdd") && (
              <a
                href="/recruiter/learning-path"
                className="inline-flex items-center rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700"
              >
                + Add Learning Path
              </a>
            )}

          </div>

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
                    <div className="flex gap-2">

                      <button
                          onClick={() => editLearningPath(path)}
                          className="rounded-xl bg-blue-900 px-4 py-2 text-white hover:bg-blue-700"
                        >
                          View
                        </button>

                      {hasPermission("Learning Paths", "canDelete") && (
                        <button
                          onClick={() => {
                            setSelectedPath(path);
                            setDeleteModalOpen(true);
                          }}
                          className="rounded-xl bg-red-600 px-4 py-2 text-white"
                        >
                          Delete
                        </button>
                      )}

                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Learning Path?"
        description={
          selectedPath
            ? `"${selectedPath.title}" will be permanently deleted. This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmText="Delete Learning Path"
        onConfirm={handleConfirmDelete}
      />
    
    </Shell>
  );
}
