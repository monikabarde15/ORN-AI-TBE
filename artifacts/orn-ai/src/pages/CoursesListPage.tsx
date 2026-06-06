// src/pages/Components/CoursesListPage.tsx

"use client";
import { Shell } from "@/components/layout/Shell";

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

import api from "../../services/api";
import "./CoursesListPage.css";

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
const [, navigate] = useLocation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

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
  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      setDeletingId(courseToDelete);
      console.log(courseToDelete);
      await api.delete(`/api/courses/${courseToDelete}`, {
        data: { courseId: courseToDelete },
      });

      setCourses((prev) => prev.filter((course) => course._id !== courseToDelete));
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      console.log("Delete error", error);
      alert("Failed to delete course");
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
        return { class: "published", label: "Published" };
      case "Draft":
        return { class: "draft", label: "Draft" };
      case "Pause":
        return { class: "pause", label: "Paused" };
      case "Upcoming":
        return { class: "upcoming", label: "Upcoming" };
      default:
        return { class: "draft", label: status || "Draft" };
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <Shell>
    <div className="dashboard-container">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <Trash2 size={24} />
            </div>
            <h3 className="modal-title">Delete Course</h3>
            <p className="modal-text">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="modal-btn confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="dashboard-header">
        <h1>Courses</h1>
        <p className="dashboard-subtitle">Let's check your update today</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Courses</span>
            <div className="stat-icon">
              <BookOpen size={16} />
            </div>
          </div>
          <div className="stat-value">{stats.total}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Published</span>
            <div className="stat-icon">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="stat-value">{stats.published}</div>
          <div className="stat-trend">
            <span>✓ Active courses</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Draft</span>
            <div className="stat-icon">
              <Users size={16} />
            </div>
          </div>
          <div className="stat-value">{stats.draft}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Revenue</span>
            <div className="stat-icon">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by course name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>

          <button className="add-course-btn" onClick={() => navigate("/recruiter/course/add")}>
            <Plus size={16} />
            Add Course
          </button>
        </div>
      </div>

      {/* Courses Table */}
      {filteredCourses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3 className="empty-title">No courses found</h3>
          <p className="empty-text">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter"
              : "Get started by creating your first course"}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <button className="add-course-btn" onClick={() => navigate("/create-course")}>
              <Plus size={16} />
              Create Course
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="courses-table-container">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Course ID</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.map((course) => {
                  const statusConfig = getStatusConfig(course.status);
                  return (
                    <tr key={course._id}>
                      <td>
                        <div className="course-info">
                          <span className="course-title">{course.title}</span>
                        </div>
                      </td>
                      <td>
                        <span className="course-id">#{course._id.slice(-8)}</span>
                      </td>
                      <td>
                        <span className="price-value">₹{Number(course.price || 0).toLocaleString()}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${statusConfig.class}`}>
                          <span className={`status-dot ${statusConfig.class}`}></span>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn view"
                            onClick={() => navigate(`/course/details/${course._id}`)}
                            title="View Course"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="action-btn edit"
                            onClick={() => navigate(`/recruiter/course/edit/${course._id}`)}
                            title="Edit Course"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteClick(course._id)}
                            disabled={deletingId === course._id}
                            title="Delete Course"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
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
                    className={`pagination-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="pagination-btn"
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
    </Shell>
  );
}