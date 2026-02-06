"use client";

import { useState } from "react";
import { UserPlus2, SearchIcon } from "lucide-react";
import { DataTable } from "@/components/table";
import { cn } from "@/lib/utils";
import { ALL_USER_FIELDS, mockUsers, type User } from "./user-types";
import { RowActions, AddUserDialog } from "./RowActions";
import { ExportMenu } from "./ExportMenu";

function getInitials(first: string, last: string) {
  const name = `${first} ${last}`.trim();
  const parts = name.split(" ");
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0][0] ?? "";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`;
}

function getFullName(user: User) {
  return `${user.first_name} ${user.last_name}`.trim();
}

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export default function UsersPage() {
  const [addUserOpen, setAddUserOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Table toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-6 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
        {/* Search */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search"
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

      <DataTable<User>
        data={mockUsers}
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
                  {getInitials(user.first_name, user.last_name)}
                </div>
                <span className="text-sm font-medium text-slate-800">
                  {getFullName(user)}
                </span>
              </div>
            ),
          },
          ...ALL_USER_FIELDS.filter(
            (f) => !["first_name", "last_name"].includes(f.id as string),
          ).map((f) => ({
            id: f.id as string,
            label: f.label,
            render: (user: User) => {
              if (f.id === "status") {
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
              }

              const value = (user as any)[f.id];
              return <span className="text-slate-700">{formatCell(value)}</span>;
            },
          })),
          {
            id: "actions",
            label: "Actions",
            headerClassName: "text-right",
            cellClassName: "text-right",
            render: (user) => (
              <RowActions user={user} />
            ),
          },
        ]}
      />

      {/* Add User Modal */}
      <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} />
    </div>
  );
}