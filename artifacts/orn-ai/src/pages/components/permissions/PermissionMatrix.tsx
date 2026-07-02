import React, {
  useEffect,
  useState,
} from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Shield,
  Save,
  CheckSquare,
  Ban,
} from "lucide-react";

import api from "../../../../services/api";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}
interface Permission {
  moduleName: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface Props {
  selectedUser: User | null;
}

const MODULES = [
  "Overview",
  "Talent Search",
  "Blogs",
  "Add Candidate",
  "Course Categories",
  "Course Management",
  "Learning Paths",
  "Live Training Sessions",
  "Training Pipeline",
  "Data Sources",
  "Settings",
];

export default function PermissionMatrix({
  selectedUser,
}: Props) {
  const [permissions, setPermissions] =
    useState<Permission[]>([]);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (selectedUser) {
      loadPermissions();
    }
  }, [selectedUser]);

  const loadPermissions = async () => {
    try {
      const { data } =
        await api.get(
          `/api/user-permissions/${selectedUser?.id}`
        );

      if (
        data.permissions &&
        data.permissions.length > 0
      ) {
        setPermissions(
          data.permissions
        );
      } else {
        setPermissions(
          MODULES.map(
            (module) => ({
              moduleName: module,
              canView: false,
              canAdd: false,
              canEdit: false,
              canDelete: false,
            })
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updatePermission = (
    moduleName: string,
    field: keyof Permission
  ) => {
    setPermissions((prev) =>
      prev.map((item) =>
        item.moduleName === moduleName
          ? {
              ...item,
              [field]:
                !item[field],
            }
          : item
      )
    );
  };

  const selectAll = () => {
    setPermissions(
      permissions.map((p) => ({
        ...p,
        canView: true,
        canAdd: true,
        canEdit: true,
        canDelete: true,
      }))
    );
  };

  const clearAll = () => {
    setPermissions(
      permissions.map((p) => ({
        ...p,
        canView: false,
        canAdd: false,
        canEdit: false,
        canDelete: false,
      }))
    );
  };

  const applyRoleTemplate = (
    role: string
  ) => {
    if (role === "admin") {
      selectAll();
      return;
    }

    if (
      role === "candidate"
    ) {
      setPermissions(
        permissions.map((p) => ({
          ...p,
          canView: true,
          canAdd: false,
          canEdit: false,
          canDelete: false,
        }))
      );

      return;
    }

    if (
      role === "recruiter"
    ) {
      setPermissions(
        permissions.map((p) => ({
          ...p,
          canView: true,
          canAdd: true,
          canEdit: true,
          canDelete: false,
        }))
      );
    }
  };

  const savePermissions = async () => {
  try {
    setSaving(true);

    await api.post(
      "/api/user-permissions",
      {
        userId: selectedUser?.id,
        permissions,
      }
    );

    toast.success(
      "Permissions saved successfully"
    );

  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to save permissions"
    );
  } finally {
    setSaving(false);
  }
};

  if (!selectedUser) {
    return (
      <div className="bg-white rounded-2xl border shadow-sm h-full flex items-center justify-center">
        <div className="text-center">
          <Shield
            className="mx-auto mb-3 text-gray-400"
            size={50}
          />

          <h3 className="font-semibold text-lg">
            Select User
          </h3>

          <p className="text-gray-500">
            Select a user to
            manage permissions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

      {/* Header */}
      <div className="p-6 border-b">

        <h2 className="text-2xl font-bold">
          Access Control
        </h2>

        <p className="text-gray-500 mt-1">
          {
            selectedUser.fullName
          }
        </p>

        <p className="text-sm text-gray-400">
          {
            selectedUser.email
          }
        </p>

      </div>

      {/* Templates */}
      <div className="p-5 border-b flex gap-3">

        <button
          onClick={() =>
            applyRoleTemplate(
              "admin"
            )
          }
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
        >
          Admin
        </button>

        <button
          onClick={() =>
            applyRoleTemplate(
              "recruiter"
            )
          }
          className="px-4 py-2 rounded-xl border"
        >
          Recruiter
        </button>

        

      </div>

      {/* Actions */}
      <div className="p-5 border-b flex gap-3">

        <button
          onClick={selectAll}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl"
        >
          <CheckSquare size={16} />
          Select All
        </button>

        <button
          onClick={clearAll}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl"
        >
          <Ban size={16} />
          Clear All
        </button>

      </div>

      {/* Matrix */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="p-4 text-left">
                Module
              </th>

              <th>
                View
              </th>

              <th>
                Add
              </th>

              <th>
                Edit
              </th>

              <th>
                Delete
              </th>

            </tr>

          </thead>

          <tbody>

            {permissions.map(
              (item) => (
                <tr
                  key={
                    item.moduleName
                  }
                  className="border-t"
                >
                  <td className="p-4 font-medium">
                    {
                      item.moduleName
                    }
                  </td>

                  {[
                    "canView",
                    "canAdd",
                    "canEdit",
                    "canDelete",
                  ].map(
                    (
                      field
                    ) => (
                      <td
                        key={
                          field
                        }
                        className="text-center"
                      >
                        <input
                          type="checkbox"
                          checked={
                            item[
                              field as keyof Permission
                            ] as boolean
                          }
                          onChange={() =>
                            updatePermission(
                              item.moduleName,
                              field as keyof Permission
                            )
                          }
                        />
                      </td>
                    )
                  )}
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* Save */}
      <div className="p-6 border-t">

        <button
          onClick={
            savePermissions
          }
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
        >
          {saving
            ? "Saving..."
            : "Save Permissions"}
        </button>

      </div>

    </div>
  );
}