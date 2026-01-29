"use client";

import {
  DownloadIcon,
  Eye,
  Lock,
  MoreVertical,
  Pencil,
  Shield,
  Trash2,
  UserPlus2,
  SearchIcon,
} from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

type Gender = "MALE" | "FEMALE" | "OTHER";
type CivilStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | "OTHER";
type Status = "ACTIVE" | "INACTIVE";

type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: Gender;
  country: string;
  passport_number: string | null;
  national_id: string | null;
  father_names: string | null;
  mother_names: string | null;
  date_of_birth: string | null;
  driver_names: string | null;
  plate_number: string | null;
  expiry_date: string | null;
  issuance_date: string | null;
  birth_place: string | null;
  issuing_country: string | null;
  civil_status: CivilStatus;
  place_of_birth: string | null;
  place_of_issue: string | null;
  province: string | null;
  district: string | null;
  sector: string | null;
  cell: string | null;
  village: string | null;
  created_at: string;
  status: Status;
};

const ALL_USER_FIELDS: Array<{ id: keyof User; label: string }> = [
  // id is kept in the type but not displayed as a column
  { id: "first_name", label: "First name" },
  { id: "last_name", label: "Last name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "gender", label: "Gender" },
  { id: "country", label: "Country" },
  { id: "passport_number", label: "Passport number" },
  { id: "national_id", label: "National ID" },
  { id: "father_names", label: "Father names" },
  { id: "mother_names", label: "Mother names" },
  { id: "date_of_birth", label: "Date of birth" },
  { id: "driver_names", label: "Driver names" },
  { id: "plate_number", label: "Plate number" },
  { id: "expiry_date", label: "Expiry date" },
  { id: "issuance_date", label: "Issuance date" },
  { id: "birth_place", label: "Birth place" },
  { id: "issuing_country", label: "Issuing country" },
  { id: "civil_status", label: "Civil status" },
  { id: "place_of_birth", label: "Place of birth" },
  { id: "place_of_issue", label: "Place of issue" },
  { id: "province", label: "Province" },
  { id: "district", label: "District" },
  { id: "sector", label: "Sector" },
  { id: "cell", label: "Cell" },
  { id: "village", label: "Village" },
  { id: "created_at", label: "Created at" },
  { id: "status", label: "Status" },
];

const mockUsers: User[] = [
  {
    id: "1",
    first_name: "David",
    last_name: "B",
    email: "davidb@example.com",
    phone: "0789878947",
    gender: "MALE",
    country: "Rwanda",
    passport_number: null,
    national_id: "1199990001112223",
    father_names: "John B Senior",
    mother_names: "Jane B",
    date_of_birth: "1990-05-12",
    driver_names: null,
    plate_number: null,
    expiry_date: null,
    issuance_date: null,
    birth_place: "Kigali",
    issuing_country: "Rwanda",
    civil_status: "SINGLE",
    place_of_birth: "Kigali",
    place_of_issue: "Kigali",
    province: "Kigali City",
    district: "Gasabo",
    sector: "Kimironko",
    cell: "Bibare",
    village: "Urugano",
    created_at: "2025-12-01T10:00:00Z",
    status: "ACTIVE",
  },
  {
    id: "2",
    first_name: "Chris",
    last_name: "M",
    email: "chris.m@example.com",
    phone: "0787485789",
    gender: "MALE",
    country: "Rwanda",
    passport_number: null,
    national_id: "1199990001112224",
    father_names: "Michael M",
    mother_names: "Claudine M",
    date_of_birth: "1992-03-01",
    driver_names: null,
    plate_number: null,
    expiry_date: null,
    issuance_date: null,
    birth_place: "Huye",
    issuing_country: "Rwanda",
    civil_status: "MARRIED",
    place_of_birth: "Huye",
    place_of_issue: "Huye",
    province: "Southern",
    district: "Huye",
    sector: "Ngoma",
    cell: "Kibingo",
    village: "Intwari",
    created_at: "2025-11-15T08:30:00Z",
    status: "ACTIVE",
  },
  {
    id: "3",
    first_name: "Ben",
    last_name: "K",
    email: "ben.k@example.com",
    phone: "078789878987",
    gender: "MALE",
    country: "Rwanda",
    passport_number: null,
    national_id: "1199990001112225",
    father_names: null,
    mother_names: null,
    date_of_birth: null,
    driver_names: null,
    plate_number: null,
    expiry_date: null,
    issuance_date: null,
    birth_place: null,
    issuing_country: null,
    civil_status: "SINGLE",
    place_of_birth: null,
    place_of_issue: null,
    province: "Kigali City",
    district: "Nyarugenge",
    sector: "Nyamirambo",
    cell: "Nyarugenge",
    village: "Icyerekezo",
    created_at: "2025-10-02T12:00:00Z",
    status: "INACTIVE",
  },
  {
    id: "4",
    first_name: "Byu",
    last_name: "D",
    email: "byu.d@example.com",
    phone: "0789878987",
    gender: "FEMALE",
    country: "Rwanda",
    passport_number: null,
    national_id: "1199990001112226",
    father_names: "Daniel D",
    mother_names: "Beatrice D",
    date_of_birth: "1988-09-20",
    driver_names: null,
    plate_number: null,
    expiry_date: null,
    issuance_date: null,
    birth_place: "Musanze",
    issuing_country: "Rwanda",
    civil_status: "MARRIED",
    place_of_birth: "Musanze",
    place_of_issue: "Musanze",
    province: "Northern",
    district: "Musanze",
    sector: "Muhoza",
    cell: "Cyana",
    village: "Amahoro",
    created_at: "2025-09-10T09:45:00Z",
    status: "ACTIVE",
  },
];

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
            className="inline-flex items-center gap-2 rounded-full bg-[#1298E5] px-5 py-2.5 text-sm font-medium text-white"
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
            (f) => !["first_name", "last_name"].includes(f.id as string)
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
                      isActive ? "bg-[#22c55e]" : "bg-red-500"
                    )}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                );
              }

              const value = (user as any)[f.id];
              return (
                <span className="text-slate-700">{formatCell(value)}</span>
              );
            },
          })),
          {
            id: "actions",
            label: "Actions",
            headerClassName: "text-right",
            cellClassName: "text-right",
            render: (user) => <RowActions user={user} />,
          },
        ]}
      />
    </div>
  );
}

function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-2 rounded-full bg-[#0b4f7a] px-5 py-2.5 text-sm font-medium text-white"
      >
        <DownloadIcon width={16} height={16} />
        <span>Export</span>
        <span className="text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl bg-white py-2 text-sm text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
          <button
            className="block w-full px-4 py-1.5 text-left hover:bg-slate-50"
            onClick={close}
          >
            Excel
          </button>
          <button
            className="block w-full px-4 py-1.5 text-left hover:bg-slate-50"
            onClick={close}
          >
            PDF
          </button>
          <button
            className="block w-full px-4 py-1.5 text-left hover:bg-slate-50"
            onClick={close}
          >
            Print
          </button>
        </div>
      )}
    </div>
  );
}
function MenuButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left transition
        hover:bg-slate-50 focus:bg-slate-50 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}

function PermissionsDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Manage User Permissions
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Add New Permission
            </label>

            <select className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-[#1298E5] focus:outline-none">
              <option>QTG</option>
              <option>RCA</option>
            </select>
          </div>

          <div>
            <select className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-[#1298E5] focus:outline-none">
              <option>institution.delete</option>
              <option>institution.update</option>
              <option>branch.create</option>
            </select>
          </div>

          <button className="h-11 w-full rounded-xl bg-black text-sm font-medium text-white">
            Add
          </button>

          {/* Current permissions */}
          <div className="pt-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-800">
              Current Permissions
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <PermissionChip label="institution.update" />
              <PermissionChip label="branch.create" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PermissionChip({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
      <span>{label}</span>
      <button className="text-red-500 hover:text-red-600">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function RowActions({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative flex items-center justify-end gap-3 text-slate-500">
      <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100">
        <Eye width={16} height={16} />
      </button>

      <button
        onClick={() => setIsOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100"
      >
        <MoreVertical width={16} height={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-30 w-40 rounded-xl bg-white text-xs shadow-lg ring-1 ring-slate-900/5">
          <MenuButton onClick={closeMenu}>
            <Pencil className="h-3.5 w-3.5 text-amber-500" />
            Edit
          </MenuButton>

          <MenuButton
            onClick={() => {
              closeMenu();
              setIsPermissionsOpen(true);
            }}
          >
            <Shield className="h-3.5 w-3.5 text-blue-600" />
            Permissions
          </MenuButton>

          <div className="my-0.5 h-px bg-slate-100" />

          <MenuButton className="text-amber-600" onClick={closeMenu}>
            <Lock className="h-3.5 w-3.5 text-amber-500" />
            Deactivate
          </MenuButton>

          <MenuButton className="text-red-600" onClick={closeMenu}>
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
            Delete
          </MenuButton>
        </div>
      )}

      {/* Permissions Modal */}
      <PermissionsDialog
        open={permissionsOpen}
        onOpenChange={setPermissionsOpen}
        user={user}
      />
    </div>
  );
}

