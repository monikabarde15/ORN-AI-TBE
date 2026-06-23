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

export default function UserPermissions() {
 const [selectedUser, setSelectedUser] =
  useState<User | null>(null);
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
  return (
    <Shell>
        <Toaster position="top-right" />

        <div className="p-6">

           <PermissionHeader
            totalUsers={users.length}
            onSelectAll={() => {}}
            onClearAll={() => {}}
            />

            <div className="grid grid-cols-12 gap-6">

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

            </div>

        </div>
    </Shell>
  );
}