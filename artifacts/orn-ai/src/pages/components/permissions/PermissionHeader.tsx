// artifacts\orn-ai\src\pages\components\permissions\PermissionHeader.tsx
import React, { useEffect, useState } from "react";
import api from "../../../../services/api";

import {
  ShieldCheck,
} from "lucide-react";
interface Props {
  totalUsers: number;

  adminCount?: number;
  recruiterCount?: number;
  candidateCount?: number;
}

export default function PermissionHeader({
  totalUsers,
  adminCount = 0,
  recruiterCount = 0,
  candidateCount = 0,
}: Props) {
    const loadUsers = async () => {
      try {
        const { data } = await api.get("/api/users");
        setUsers(data.users || []);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      loadUsers();
    }, []);
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
        {/* <div className="flex items-center gap-3">

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

        </div> */}

      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Users
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {totalUsers}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Admins
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {adminCount}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Recruiters
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {recruiterCount}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Candidates
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {candidateCount}
            </h2>
          </div>

        </div>

    </div>
    </>
  );
}