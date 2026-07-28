// src/pages/Components/CoursesListPage.tsx

"use client";
import { Shell } from "@/components/layout/Shell";
import { useAuth } from "@/hooks/use-auth";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  BookOpen,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

import api from "../../services/api";

interface Course {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  promotionalVideo?: string;
  category?: string;
  price?: string | number;
  status: string;
  instructor?: string;
  studentsCount?: number;
  lessonCount?: number;
  quizCount?: number;
  videoCount?: number;
  createdAt?: string;
}

export default function CoursesListPage() {
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
  
  console.log(user);
  const [, navigate] = useLocation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalRevenue: 0,
  });

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/courses");

      const courseData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setCourses(courseData);

      // Calculate stats
      const published = courseData.filter((c: Course) => c.status === "Published").length;
      const draft = courseData.filter((c: Course) => c.status === "Draft").length;
      const totalRevenue = courseData.reduce((sum: number, c: Course) => sum + (Number(c.price) || 0), 0);

      setStats({
        total: courseData.length,
        published,
        draft,
        totalRevenue,
      });
    } catch (error) {
      console.log("Fetch courses error", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= FILTER & SEARCH =================
  useEffect(() => {
    let filtered = [...courses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter);
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, courses]);

  // ================= DELETE COURSE =================
  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      setDeletingId(courseToDelete._id);

      await api.delete(`/api/courses/${courseToDelete._id}`, {
        data: { courseId: courseToDelete._id },
      });

      setCourses((prev) =>
        prev.filter((course) => course._id !== courseToDelete._id)
      );
      setShowDeleteModal(false);
      setCourseToDelete(null);
      toast.success("Course deleted successfully");
    } catch (error) {
      console.log("Delete error", error);
      toast.error("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= GET STATUS COLOR =================
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Published":
        return { class: "bg-green-100 text-green-700", label: "Published" };
      case "Draft":
        return { class: "bg-amber-100 text-amber-700", label: "Draft" };
      case "Pause":
        return { class: "bg-red-100 text-red-700", label: "Paused" };
      case "Upcoming":
        return { class: "bg-blue-100 text-blue-700", label: "Upcoming" };
      default:
        return { class: "bg-amber-100 text-amber-700", label: status || "Draft" };
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <Shell>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center p-12">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-900 rounded-full animate-spin"></div>
              <p className="text-sm text-muted-foreground mt-4">Loading courses...</p>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // ================= UI =================
  return (
    <Shell>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">
              Courses
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Let's check your update today
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <p className="text-xs uppercase text-muted-foreground font-medium tracking-wide">
                Total Courses
              </p>
              <h2 className="text-4xl font-bold mt-3 text-slate-900">{stats.total}</h2>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <p className="text-xs uppercase text-muted-foreground font-medium tracking-wide">
                Published
              </p>
              <h2 className="text-4xl font-bold mt-3 text-green-600">{stats.published}</h2>
              <p className="text-xs text-green-600 mt-1">✓ Active courses</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <p className="text-xs uppercase text-muted-foreground font-medium tracking-wide">
                Draft
              </p>
              <h2 className="text-4xl font-bold mt-3 text-amber-500">{stats.draft}</h2>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <p className="text-xs uppercase text-muted-foreground font-medium tracking-wide">
                Total Revenue
              </p>
              <h2 className="text-4xl font-bold mt-3 text-blue-900">
                ₹{stats.totalRevenue.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex justify-between gap-4 flex-wrap">
            <div className="relative w-full max-w-xl">
              <Search
                className="absolute left-3 top-3 text-muted-foreground"
                size={18}
              />
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition"
                placeholder="Search by course name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <select
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-blue-900"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>

              {hasPermission("Course Management", "canAdd") && (
                <button
                  className="bg-blue-900 text-white px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-blue-800 transition shadow-sm"
                  onClick={() => navigate("/recruiter/course/add")}
                >
                  <Plus size={18} />
                  Add Course
                </button>
              )}
            </div>
          </div>

          {/* Courses Table */}
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No courses found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Get started by creating your first course"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <button
                  className="bg-blue-900 text-white px-5 py-2 rounded-xl flex items-center gap-2 mx-auto text-sm font-medium hover:bg-blue-800 transition"
                  onClick={() => navigate("/create-course")}
                >
                  <Plus size={18} />
                  Create Course
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left p-4 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                          Course Name
                        </th>
                        <th className="text-left p-4 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                          Course ID
                        </th>
                        <th className="text-left p-4 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                          Price
                        </th>
                        <th className="text-left p-4 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                          Status
                        </th>
                        <th className="text-left p-4 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCourses.map((course) => {
                        const statusConfig = getStatusConfig(course.status);
                        return (
                          <tr key={course._id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span>{course.title}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-muted-foreground font-mono">
                                #{course._id.slice(-8)}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-slate-900">₹{Number(course.price || 0).toLocaleString()}</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                {hasPermission("Course Management", "canView") && (
                                  <button
                                    className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition"
                                    onClick={() =>
                                      navigate(`/course/details/${course._id}`)
                                    }
                                    title="View Course"
                                  >
                                    <Eye size={16} className="text-blue-700" />
                                  </button>
                                )}
                                {hasPermission("Course Management", "canEdit") && (
                                  <button
                                    className="p-2 bg-amber-100 rounded-lg hover:bg-amber-200 transition"
                                    onClick={() =>
                                      navigate(`/recruiter/course/edit/${course._id}`)
                                    }
                                  >
                                    <Edit size={16} className="text-amber-700" />
                                  </button>
                                )}
                                {hasPermission("Course Management", "canDelete") && (
                                  <button
                                    className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => handleDeleteClick(course)}
                                    disabled={deletingId === course._id}
                                  >
                                    <Trash2 size={16} className="text-red-700" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-end items-center gap-2 mt-6">
                  <button
                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm hover:border-blue-900 hover:text-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`px-4 py-2 border rounded-xl text-sm transition bg-white ${
                          currentPage === pageNum
                            ? "bg-blue-900 text-black border-blue-900"
                            : "border-slate-200 hover:border-blue-900 hover:text-blue-900"
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm hover:border-blue-900 hover:text-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Course?"
        description={
          courseToDelete
            ? `"${courseToDelete.title}" will be permanently deleted. This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmText="Delete Course"
        loading={!!deletingId}
        onConfirm={confirmDelete}
      />
    </Shell>
  );
}