import React, { useState } from "react";
import {
  ShieldCheck,
  CheckSquare,
  Ban,
  UserPlus
} from "lucide-react";
import AddUserModal from "@/components/ui/AddUserModal";
interface Props {
  totalUsers: number;
  onSelectAll: () => void;
  onClearAll: () => void;
  // onAddUser: () => void;
}

export default function PermissionHeader({
  totalUsers,
  onSelectAll,
  onClearAll,
}: Props) {

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  return (
    <>
    <div className="mb-6">

      <div className="flex items-center justify-between">

        {/* Left */}
        <div>

          <div className="flex items-center gap-3">

            <div
              className="
              h-12
              w-12
              rounded-xl
              bg-indigo-100
              flex
              items-center
              justify-center
              "
            >
              <ShieldCheck
                className="text-blue-900"
                size={24}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Permission Management
              </h1>

              <p className="text-gray-500 mt-1">
                Manage user roles and access permissions
                across the platform
              </p>
            </div>

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3">


          {/* ADD USER BUTTON */}

          <button
            onClick={() => setShowAddUserModal(true)}
            className="
    flex
    items-center
    gap-2
    px-4
    py-3
    rounded-xl
    bg-blue-900
    text-white
    hover:bg-blue-800
    transition
    shadow-sm
  "
          >
            <UserPlus size={18} />
            Add User
          </button>


          <div
            className="
            hidden
            md:flex
            items-center
            bg-white
            border
            rounded-xl
            px-4
            py-3
            shadow-sm
            "
          >
            <span className="text-sm text-gray-500">
              Total Users
            </span>

            <span className="ml-2 font-semibold text-blue-900">
              {totalUsers}
            </span>
          </div>

          <button
            onClick={onSelectAll}
            className="
            flex
            items-center
            gap-2
            px-4
            py-3
            rounded-xl
            bg-green-600
            text-white
            hover:bg-green-700
            transition
            "
          >
            <CheckSquare size={18} />
            Select All
          </button>

          <button
            onClick={onClearAll}
            className="
            flex
            items-center
            gap-2
            px-4
            py-3
            rounded-xl
            bg-red-600
            text-white
            hover:bg-red-700
            transition
            "
          >
            <Ban size={18} />
            Clear All
          </button>

        </div>

      </div>

    </div>

      <AddUserModal
        open={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={(data) => {
          console.log("New User:", data);

          // Backend team will handle API integration
          setShowAddUserModal(false);
        }}
      />
    </>
  );
}