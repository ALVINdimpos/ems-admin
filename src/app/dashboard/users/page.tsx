"use client";

import { useCallback, useEffect, useState } from "react";
import { UserPlus2, SearchIcon } from "lucide-react";
import { DataTable } from "@/components/table";
import { cn } from "@/lib/utils";
import { RowActions, AddUserDialog } from "./RowActions";
import { ExportMenu } from "./ExportMenu";
import { usersApi, type ApiUser } from "@/features/users/api";
import { STORAGE_KEYS } from "@/lib/constants";

function getInitials(first?: string | null, last?: string | null) {
  const name = `${first ?? ""} ${last ?? ""}`.trim();
  const parts = name.split(" ");
  if (!parts.length || !parts[0]) return "";
  if (parts.length === 1) return parts[0][0] ?? "";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`;
}

function getFullName(user: ApiUser) {
  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return name || user.email || "User";
}

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export default function UsersPage() {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
          : null;

      if (!token) {
        setError("You are not authenticated.");
        setUsers([]);
        return;
      }

      const response = await usersApi.list(
        { page, limit, search },
        token,
      );

      if (!response.success || !response.data) {
        setError(response.error || "Failed to load users.");
        setUsers([]);
        return;
      }

      setUsers(response.data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Something went wrong while loading users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  return (
    <div className="space-y-4">
      {/* Table toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-6 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
        {/* Search */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1298E5] focus:bg-white focus:outline-none"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon width={18} height={18} />
          </span>
        </div>

        {/* Right actions */}
        <div className="flex flex-wrap items-center gap-3">
          <ExportMenu />

          {/* Add user button */}
          <button
            type="button"
            onClick={() => setAddUserOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#1298E5] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0b7cc1]"
          >
            <UserPlus2 width={16} height={16} />
            <span>Add User</span>
          </button>

          {/* Rows select (static for now) */}
          <div className="relative">
            <select className="h-11 appearance-none rounded-full border border-slate-200 bg-white px-5 pr-10 text-sm text-slate-700 focus:border-[#1298E5] focus:outline-none">
              <option>25 rows</option>
              <option>50 rows</option>
              <option>100 rows</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
              ▾
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 px-2">{error}</p>
      )}

      <DataTable<ApiUser>
        data={users}
        getRowKey={(row) => row.id}
        containerClassName="max-h-[65vh]"
        columns={[
          {
            id: "name",
            label: "Name",
            headerClassName: "min-w-[240px] text-white",
            cellClassName: "min-w-[240px]",
            render: (user) => (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <span className="text-sm font-medium text-slate-800">
                  {getFullName(user)}
                </span>
              </div>
            ),
          },
          {
            id: "email",
            label: "Email",
            render: (user: ApiUser) => (
              <span className="text-slate-700">
                {formatCell(user.email)}
              </span>
            ),
          },
          {
            id: "phone",
            label: "Phone",
            render: (user: ApiUser) => (
              <span className="text-slate-700">
                {formatCell(user.phone)}
              </span>
            ),
          },
          {
            id: "status",
            label: "Status",
            render: (user: ApiUser) => {
              const isActive = user.status === "ACTIVE";
              return (
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-white",
                    isActive ? "bg-[#22c55e]" : "bg-red-500",
                  )}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              );
            },
          },
          {
            id: "createdAt",
            label: "Created At",
            render: (user: ApiUser) => (
              <span className="text-slate-700">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            ),
          },
          {
            id: "actions",
            label: "Actions",
            headerClassName: "text-right",
            cellClassName: "text-right",
            render: (user) => (
              <RowActions user={user} onUserChange={fetchUsers} />
            ),
          },
        ]}
      />

      {/* Add User Modal */}
      <AddUserDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onSuccess={fetchUsers}
      />
    </div>
  );
}