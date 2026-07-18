// artifacts\orn-ai\src\pages\components\permissions\UserListPanel.tsx
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../../../../services/api";
import AddUserModal from "@/components/ui/AddUserModal";
import { Toaster, toast } from "react-hot-toast";
import {
  ShieldCheck,
  Pencil,
  Trash2,
} from "lucide-react";
interface User {
  id: string;
  employeeId?: string;

  fullName: string;
  email: string;
  role: string;

  firstName?: string;
  middleName?: string;
  lastName?: string;

  mobile?: string;
  username?: string;

  company?: string;
  department?: string;
  designation?: string;

  country?: string;
  state?: string;
  city?: string;

  status?: string;
  candidateCode?: string;
}

interface Props {
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  showCandidates?: boolean;
}

export default function UserListPanel({
  selectedUser,
  onSelectUser,
  showCandidates = false,
}: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
const [editUser, setEditUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const pageSize = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const { data } =
        await api.get("/api/users");

     const users = data.users || [];

        users.sort((a, b) => {
          const aNum = parseInt(
            a.employeeId?.match(/\d+$/)?.[0] || "0",
            10
          );

          const bNum = parseInt(
            b.employeeId?.match(/\d+$/)?.[0] || "0",
            10
          );

          return aNum - bNum;
        });

        setUsers(users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
const handleEdit = async (user: User) => {
  try {
    const { data } = await api.get(`/api/users/${user.id}`);
    setEditUser(data.user || user);
  } catch (err) {
    console.error("Failed to load user details", err);
    setEditUser(user);
    toast.error("Could not load latest user details");
  } finally {
    setShowEditModal(true);
  }
};

const handleDelete = async (id: string) => {
  if (!window.confirm("Are you sure you want to delete this user?")) {
    return;
  }

  try {
    await api.delete(`/api/users/${id}`);

    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted successfully");
  } catch (err) {
    console.error(err);
  }
};
  const roleFilteredUsers = users.filter((user) =>
    showCandidates ? user.role === "candidate" : user.role !== "candidate"
  );

  const filteredUsers = roleFilteredUsers.filter(
    (user) =>
      (user.fullName || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase()) ||
      (user.email || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredUsers.length / pageSize
  );

  const paginatedUsers =
    filteredUsers.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

  const getRoleColor = (
    role: string
  ) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";

      case "recruiter":
        return "bg-green-100 text-green-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border h-full">

      {/* Header */}
      {/* <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">
          Users
        </h3>

        <div className="relative mt-3">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl"
          />
        </div>
      </div> */}

      <div className="p-6 border-b">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}

          <div className="relative w-full lg:max-w-md">

            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-xl border pl-10 pr-4 py-3"
            />

          </div>

          {/* Actions */}

          {!showCandidates && <div className="flex items-center gap-3">

            <button
              className="
        rounded-xl
        bg-green-600
        px-4
        py-3
        text-white
        hover:bg-green-700
        "
            >
              Select All
            </button>

            <button
              className="
        rounded-xl
        bg-red-600
        px-4
        py-3
        text-white
        hover:bg-red-700
        "
            >
              Clear All
            </button>

          </div>}

        </div>

      </div>


      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50 border-b">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                {showCandidates ? "Candidate Code" : "Employee ID"}
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Name & Email
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Role
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {paginatedUsers.map((user) => (

              <tr
                key={user.id}
                className={`
    border-b
    transition-all
    hover:bg-slate-50
    ${selectedUser?.id === user.id
                    ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                    : ""
                  }
  `}
              >

                {/* Employee ID */}

                <td className="px-6 py-5">

                 
                  {showCandidates ? user.candidateCode || "—" : user.employeeId || "—"}

                </td>

                {/* Name */}

                <td className="px-6 py-5">

                  <div className="font-semibold">
                    {user.fullName}
                  </div>

                  <div className="text-sm text-gray-500">
                    {user.email}
                  </div>

                </td>

                {/* Role */}

                <td className="px-6 py-5">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>

                </td>

                {/* Status */}

                <td className="px-6 py-5 text-center">

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                    Active
                  </span>

                </td>

                {/* Action */}

                <td className="px-6 py-5">
  <div className="flex items-center justify-center gap-2">

    {!showCandidates && (
      <button
        onClick={() => onSelectUser(user)}
        title="Access Control"
        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
          selectedUser?.id === user.id
            ? "bg-indigo-600 text-white"
            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
        }`}
      >
        <ShieldCheck size={18} />
      </button>
    )}

    {/* Edit */}
    <button
      onClick={() => handleEdit(user)}
      title="Edit User"
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"
    >
      <Pencil size={18} />
    </button>

    {/* Delete */}
    <button
      onClick={() => handleDelete(user.id)}
      title="Delete User"
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
    >
      <Trash2 size={18} />
    </button>

  </div>
</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Footer Pagination */}
      <div className="border-t p-4">

        <div className="flex justify-center gap-2">

          <button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                (p) => p - 1
              )
            }
            className="
            px-3 py-1
            border
            rounded-lg
            disabled:opacity-50
            "
          >
            Prev
          </button>

          <span className="px-3 py-1">
            {currentPage} / {totalPages || 1}
          </span>

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
            px-3 py-1
            border
            rounded-lg
            disabled:opacity-50
            "
          >
            Next
          </button>

        </div>

      </div>
<AddUserModal
  open={showEditModal}
  onClose={() => {
    setShowEditModal(false);
    setEditUser(null);
  }}
  mode="edit"
  initialData={editUser}
  onSubmit={() => {
    setShowEditModal(false);
    loadUsers();
  }}
/>
    </div>
    
  );
}
