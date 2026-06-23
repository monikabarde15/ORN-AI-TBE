// CourseCategoryManagement.tsx

import React, { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Search, Pencil, Trash, Plus, X } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "@/hooks/use-auth";

import { toast, Toaster } from "react-hot-toast"
interface Category {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  status: string;
  createdAt?: string;
}

export default function CourseCategoryManagement() {
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
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  const loadCategories = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/course-category/list");

      setCategories(res.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const saveCategory = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Category Name Required");
        return;
      }

      if (editingId) {
        await api.put(
          `/api/course-category/update/${editingId}`,
          formData
        );
        toast.success("Category Updated Successfully");
      } else {
        await api.post(
          "/api/course-category/create",
          formData
        );
        toast.success("Category Created Successfully");
      }

      setShowModal(false);
      setEditingId(null);

      setFormData({
        name: "",
        description: "",
        status: "Active",
      });

      loadCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm("Delete Category?")) return;

    try {
      await api.delete(`/api/course-category/delete/${id}`);
      loadCategories();
       toast.success("Category Deleted Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed To Delete Category");
    }
  };

  const activeCount = categories.filter(
    (c) => c.status === "Active"
  ).length;

  const inactiveCount = categories.filter(
    (c) => c.status === "Inactive"
  ).length;

  const filtered = categories.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Shell>
       <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
    }}
  />
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold">
              Course Categories
            </h1>

            <p className="text-slate-500 mt-2">
              Manage Course Categories
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <p className="text-xs uppercase text-gray-500">
                Total Categories
              </p>
              <h2 className="text-4xl font-bold mt-3">
                {categories.length}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <p className="text-xs uppercase text-gray-500">
                Active
              </p>
              <h2 className="text-4xl font-bold mt-3">
                {activeCount}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <p className="text-xs uppercase text-gray-500">
                Inactive
              </p>
              <h2 className="text-4xl font-bold mt-3">
                {inactiveCount}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <p className="text-xs uppercase text-gray-500">
                New This Month
              </p>
              <h2 className="text-4xl font-bold mt-3">
                {categories.length}
              </h2>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white border rounded-2xl p-4 mb-6 flex justify-between gap-4">
            <div className="relative w-full max-w-xl">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Category..."
                className="w-full border rounded-xl pl-10 pr-4 py-3"
              />
            </div>

            {hasPermission("Course Categories", "canAdd") && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: "",
                    description: "",
                    status: "Active",
                  });
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-5 rounded-xl flex items-center gap-2"
              >
                <Plus size={18} />
                Add Category
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-4">{item.name}</td>

                      <td className="p-4">
                        {item.description}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            item.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          {hasPermission("Course Categories", "canEdit") && (
                              <button
                                onClick={() => {
                                  setEditingId(item.id);

                                  setFormData({
                                    name: item.name,
                                    description: item.description,
                                    status: item.status,
                                  });

                                  setShowModal(true);
                                }}
                                className="p-2 bg-blue-100 rounded"
                              >
                                <Pencil size={16} />
                              </button>
                            )}

                          {hasPermission("Course Categories", "canDelete") && (
                            <button
                              onClick={() => deleteCategory(item.id)}
                              className="p-2 bg-red-100 rounded"
                            >
                              <Trash size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingId
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
              >
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                value={formData.name}
                placeholder="Category Name"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <textarea
                rows={4}
                value={formData.description}
                placeholder="Description"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="Active">
                  Active
                </option>
                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border px-5 py-2 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={saveCategory}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}