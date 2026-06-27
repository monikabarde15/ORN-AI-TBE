import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../../../../services/api";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface Props {
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
}

export default function UserListPanel({
  selectedUser,
  onSelectUser,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const pageSize = 8;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const { data } =
        await api.get("/api/users");

     const users = data.users || [];

        users.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setUsers(users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
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
      <div className="p-4 border-b">
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
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl"
          />
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto h-[650px]">

        {loading ? (
          <div className="p-8 text-center">
            Loading...
          </div>
        ) : (
          paginatedUsers.map((user) => (
            <button
              key={user.id}
              onClick={() =>
                onSelectUser(user)
              }
              className={`w-full text-left p-4 border-b hover:bg-gray-50 transition ${
                selectedUser?.id === user.id
                  ? "bg-indigo-50 border-l-4 border-indigo-600"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">

                <div
                  className="
                  w-12
                  h-12
                  rounded-full
                  bg-indigo-100
                  flex
                  items-center
                  justify-center
                  font-semibold
                  text-indigo-700
                  "
                >
                  {user.fullName
                    ?.split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="flex-1">

                  <div className="font-medium">
                    {user.fullName}
                  </div>

                  <div className="text-sm text-gray-500">
                    {user.email}
                  </div>

                  <span
                    className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>

                </div>

              </div>
            </button>
          ))
        )}

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

    </div>
  );
}