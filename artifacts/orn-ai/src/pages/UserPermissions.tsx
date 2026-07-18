import React, { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Toaster } from "react-hot-toast";
import api from "../../services/api";
import UserListPanel from "./components/permissions/UserListPanel";
import PermissionMatrix from "./components/permissions/PermissionMatrix";
import PermissionHeader from "./components/permissions/PermissionHeader";
import {
  Search,
  Shield,
  Edit,
  Save,
  X,
} from "lucide-react";

const MODULES = [
  "Talent Search",
  "Blogs",
  "Add Candidate",
  "Course Categories",
  "Course Management",
  "Learning Paths",
  "Live Training Sessions",
  "Training Pipeline",
  "Overview",
  "Data Sources",
  "Settings",
];

interface Permission {
  moduleName: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function UserPermissions({ showCandidates = false }: { showCandidates?: boolean }) {
  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [showPermissionDrawer, setShowPermissionDrawer] =
    useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/api/users");
      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
    }
  };
  const adminCount = users.filter((item) => item.role === "admin").length;
  const recruiterCount = users.filter((item) => item.role === "recruiter").length;
  const candidateCount = users.filter((item) => item.role === "candidate").length;
  return (
    <Shell>
      <Toaster position="top-right" />

      <div className="p-6">

        <PermissionHeader
          totalUsers={showCandidates ? candidateCount : users.length}
          showCandidates={showCandidates}
          adminCount={adminCount}
          recruiterCount={recruiterCount}
          candidateCount={candidateCount}
        />

        {/* <div className="grid grid-cols-12 gap-6">

          <div className="col-span-4">
            <UserListPanel
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
            />
          </div>

          <div className="col-span-8">
            <PermissionMatrix
              selectedUser={
                selectedUser
              }
            />
          </div>

        </div> */}

        <div className="space-y-6">

          <UserListPanel
            showCandidates={showCandidates}
            selectedUser={selectedUser}
            onSelectUser={(user) => {
              setSelectedUser(user);
              setShowPermissionDrawer(true);
            }}
          />

          {/* Permission Matrix */}

          {/* {selectedUser && (
            <div className="mt-6">
              <PermissionMatrix
                selectedUser={selectedUser}
              />
            </div>
          )} */}

        </div>

      </div>

      {showPermissionDrawer && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => {
              setShowPermissionDrawer(false);
              setSelectedUser(null);
            }}
            className="fixed inset-0 z-40 bg-black/40"
          />

          {/* Drawer */}
          <div
            className="
        fixed
        right-0
        top-0
        z-50
        h-screen
        w-full
        max-w-3xl
        overflow-y-auto
        bg-white
        shadow-2xl
        transition-transform
        duration-300
      "
          >
            <PermissionMatrix
              selectedUser={selectedUser}
              onClose={() => {
                setShowPermissionDrawer(false);
                setSelectedUser(null);
              }}
            />
          </div>
        </>
      )}
    </Shell>
  );
}
