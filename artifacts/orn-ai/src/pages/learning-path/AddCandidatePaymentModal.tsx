import React, { useEffect, useState } from "react";
import { Search, X, UserPlus, Check, Loader2 } from "lucide-react";
import api from "../../../services/api";
import { toast } from "sonner";

export interface CandidateUser {
  id: string;
  candidateCode?: string;
  employeeId?: string;
  fullName: string;
  email: string;
  role: string;
  status?: string;
}

interface AddCandidatePaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSend?: (selectedCandidates: CandidateUser[]) => Promise<void> | void;
}

export default function AddCandidatePaymentModal({
  open,
  onClose,
  onSend,
}: AddCandidatePaymentModalProps) {
  const [users, setUsers] = useState<CandidateUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/users");
      const userList: CandidateUser[] = data.users || [];

      // Filter for candidates primarily or list all available users
      const candidates = userList.filter((u) => u.role === "candidate" || u.candidateCode);
      setUsers(candidates.length > 0 ? candidates : userList);
    } catch (error) {
      console.error("Failed to load candidates:", error);
      toast.error("Failed to load candidate list");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const filteredUsers = users.filter((u) => {
    const query = search.trim().toLowerCase();
    return (
      (u.fullName || "").toLowerCase().includes(query) ||
      (u.email || "").toLowerCase().includes(query) ||
      (u.candidateCode || "").toLowerCase().includes(query) ||
      (u.employeeId || "").toLowerCase().includes(query)
    );
  });

  const toggleSelectAll = () => {
    if (selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const toggleSelectUser = (id: string) => {
    const next = new Set(selectedUserIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedUserIds(next);
  };

  const handleSend = async () => {
    const selectedList = users.filter((u) => selectedUserIds.has(u.id));
    if (selectedList.length === 0) {
      toast.error("Please select at least one candidate");
      return;
    }

    try {
      setSending(true);
      if (onSend) {
        await onSend(selectedList);
      } else {
        toast.success(`Successfully sent to ${selectedList.length} candidate(s)`);
      }
      onClose();
    } catch (error: any) {
      console.error("Send error:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1652A0] text-white">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add Candidates</h2>
              <p className="text-xs text-slate-300">Select candidates to send learning path payment details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-slate-50">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or candidate code..."
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:border-[#1652A0] focus:ring-2 focus:ring-[#1652A0]/20 outline-none"
            />
          </div>
        </div>

        {/* Candidates Table */}
        <div className="overflow-y-auto flex-1 p-4">
          {loading ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin text-[#1652A0]" />
              <p className="text-sm font-medium">Loading candidate list...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-gray-500">
              <p className="text-sm font-medium">No candidates found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-100 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <th className="p-3 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredUsers.length > 0 &&
                        selectedUserIds.size === filteredUsers.length
                      }
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-[#1652A0] focus:ring-[#1652A0]"
                    />
                  </th>
                  <th className="p-3">Candidate Code</th>
                  <th className="p-3">Name & Email</th>
                  <th className="p-3 text-center">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUserIds.has(user.id);
                  return (
                    <tr
                      key={user.id}
                      onClick={() => toggleSelectUser(user.id)}
                      className={`cursor-pointer transition-colors hover:bg-slate-50 ${isSelected ? "bg-blue-50/60" : ""
                        }`}
                    >
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectUser(user.id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#1652A0] focus:ring-[#1652A0]"
                        />
                      </td>
                      <td className="p-3 font-semibold text-gray-700">
                        {user.candidateCode || user.employeeId || "—"}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-900">{user.fullName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-[#1652A0] capitalize">
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-slate-50 px-6 py-4">
          <div className="text-sm font-medium text-gray-600">
            {selectedUserIds.size > 0 ? (
              <span className="text-[#1652A0] font-bold">
                {selectedUserIds.size} candidate(s) selected
              </span>
            ) : (
              "No candidates selected"
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={selectedUserIds.size === 0 || sending}
              className="flex items-center gap-2 rounded-xl bg-[#1652A0] hover:bg-[#124282] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
