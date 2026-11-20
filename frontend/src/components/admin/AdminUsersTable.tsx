"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { api } from "../../lib/api";
import { AdminUserItem } from "../../types";
import { formatDate } from "../../lib/utils";
import {
  Search,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const AdminUsersTable: React.FC = () => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminUsers({
        page,
        limit: 15,
        search: search.trim() || undefined,
        role: roleFilter || undefined,
      });
      setUsers(res.data || []);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalRecords(res.meta.totalRecords || 0);
      }
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        msg: err instanceof Error ? err.message : "Failed to load users",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action is irreversible.`)) {
      return;
    }

    try {
      setActionLoading(userId);
      setFeedback(null);
      await api.deleteAdminUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setTotalRecords((prev) => prev - 1);
      setFeedback({ type: "success", msg: `User "${userName}" deleted.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        msg: err instanceof Error ? err.message : "Failed to delete user",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-black text-gray-900">User Management</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Total {totalRecords} accounts registered across all roles
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
          </form>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 outline-none cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="BUYER">Buyers</option>
            <option value="OWNER">Owners</option>
            <option value="AGENT">Agents</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <p className="text-xs text-gray-500 mt-2 font-medium">Loading user accounts...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="py-12 text-center text-xs text-gray-400">
          No user accounts found matching your query.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">User</th>
                <th className="pb-3 font-bold">Contact</th>
                <th className="pb-3 font-bold">Role</th>
                <th className="pb-3 font-bold">Activity</th>
                <th className="pb-3 font-bold">Joined</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 overflow-hidden border border-blue-200">
                        {u.avatar ? (
                          <Image src={u.avatar} alt={u.name} fill sizes="32px" className="object-cover" />
                        ) : (
                          <span>{u.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{u.name}</p>
                        <p className="text-[11px] text-gray-400">{u.city || "No city"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 pr-3">
                    <p className="text-gray-800 font-medium">{u.email}</p>
                    <p className="text-[11px] text-gray-400">{u.phone || "No phone"}</p>
                  </td>

                  <td className="py-3.5 pr-3">
                    <span
                      className={`inline-flex items-center text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-900 border-purple-300 font-black shadow-xs"
                          : u.role === "AGENT"
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : u.role === "OWNER"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-blue-100 text-blue-900 border-blue-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3.5 pr-3 text-gray-600 font-medium">
                    <span>{u._count.properties} Listings</span> • <span>{u._count.leadsSent} Inquiries</span>
                  </td>

                  <td className="py-3.5 pr-3 text-gray-400 text-[11px]">
                    {formatDate(u.createdAt)}
                  </td>

                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      disabled={actionLoading === u.id}
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
          <span className="text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
