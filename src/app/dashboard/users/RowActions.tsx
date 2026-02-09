"use client";

import React, { useEffect, useState } from "react";
import {
  Eye,
  Lock,
  MoreVertical,
  Pencil,
  Shield,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Button from "@/components/ui/Button/index";
import type { ApiUser } from "@/features/users/api";
import {
  usersApi,
  USER_TYPES,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "@/features/users/api";
import { rolesApi, type Role } from "@/features/roles/api";
import { STORAGE_KEYS } from "@/lib/constants";
import { toast } from "sonner";

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

function fakeApi<T>(result: T, shouldFail = false, delay = 800): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      shouldFail ? reject(new Error("Something went wrong")) : resolve(result);
    }, delay);
  });
}

function PermissionChip({
  label,
  onDelete,
}: {
  label: string;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
      <span>{label}</span>
      <button onClick={onDelete} className="text-red-500 hover:text-red-600">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function DeletePermissionDialog({
  permission,
  onConfirm,
  onCancel,
}: {
  permission: string | null;
  onConfirm: (permission: string) => void;
  onCancel: () => void;
}) {
  return (
    <AlertDialog open={!!permission} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove permission?</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately revoke{" "}
            <span className="font-medium">{permission}</span> from this user.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => permission && onConfirm(permission)}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function PermissionsDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ApiUser;
}) {
  const [permissions, setPermissions] = useState<string[]>([
    "institution.update",
    "branch.create",
  ]);
  const [newPermission, setNewPermission] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [organization, setOrganization] = useState<string>("");

  async function addPermission() {
    if (!newPermission || permissions.includes(newPermission)) return;

    // optimistic update
    setPermissions((p) => [...p, newPermission]);
    setNewPermission("");

    try {
      await fakeApi(true);
    } catch {
      // rollback
      setPermissions((p) => p.filter((x) => x !== newPermission));
    }
  }

  async function removePermission(permission: string) {
    const prev = permissions;

    // optimistic remove
    setPermissions((p) => p.filter((x) => x !== permission));
    setDeleting(null);

    try {
      await fakeApi(true);
    } catch {
      // rollback
      setPermissions(prev);
    }
  }

  const selectClass =
    "h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 shadow-sm focus:border-[#1298E5] focus:outline-none";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Manage User Permissions</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <select
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className={selectClass}
          >
            <option value="">Select organization</option>
            <option value="MINAGRI">MINAGRI</option>
            <option value="RICA">RICA</option>
            <option value="RDB">RDB</option>
          </select>
          <DropdownIcon />
        </div>

        {/* Add permission */}
        <div className="space-y-3">
          <div className="relative">
            <select
              value={newPermission}
              onChange={(e) => setNewPermission(e.target.value)}
              className={selectClass}
            >
              <option value="">Select permission</option>
              <option value="event.delete">event.delete</option>
              <option value="event.update">event.update</option>
              <option value="event.create">event.create</option>
              <option value="event.view">event.view</option>
            </select>
            <DropdownIcon />
          </div>

          <Button className="w-full" onClick={addPermission}>
            Add
          </Button>
        </div>

        {/* Current permissions */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Current Permissions
              </h4>

              {/* Organization badge */}
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs">
                <span className="text-slate-500">{organization}</span>
              </div>
            </div>
          </div>

          {/* Permissions list */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {permissions.length > 0 ? (
              permissions.map((perm) => (
                <PermissionChip
                  key={perm}
                  label={perm}
                  onDelete={() => setDeleting(perm)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 py-8 text-sm text-slate-500">
                <span className="font-medium">No permissions assigned</span>
                <span className="mt-1 text-xs text-slate-400">
                  Permissions will appear here once added
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Delete confirm */}
        <DeletePermissionDialog
          permission={deleting}
          onConfirm={removePermission}
          onCancel={() => setDeleting(null)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function AddUserDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+250");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [roleId, setRoleId] = useState("");
  const [userType, setUserType] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) return;
    setRolesLoading(true);
    rolesApi
      .list({ limit: 100 }, token)
      .then((res) => {
        if (res.success && res.data) setRoles(Array.isArray(res.data) ? res.data : []);
      })
      .finally(() => setRolesLoading(false));
  }, [open]);

  function handleClose() {
    onOpenChange(false);
    setSubmitError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      setSubmitError("Not authenticated");
      return;
    }
    if (!email.trim() || !firstName.trim() || !lastName.trim() || !roleId || !userType) {
      setSubmitError("Email, first name, last name, role and user type are required");
      return;
    }
    setSubmitLoading(true);
    const phone = phoneNumber.trim()
      ? `${phoneCountryCode.replace(/\s/g, "")}${phoneNumber.trim()}`
      : undefined;
    const payload: CreateUserPayload = {
      email: email.trim(),
      password: "TempPass123!",
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone,
      roleId,
      userType,
    };
    const res = await usersApi.create(payload, token);
    console.log("Response from create user:", res);
    setSubmitLoading(false);
    if (!res.success) {
      setSubmitError(res.error ?? "Failed to create user");
      return;
    }
    toast.success("User created successfully");
    onSuccess?.();
    onOpenChange(false);
  }

  const inputClass =
    "h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-[#1298E5] focus:outline-none";
  const selectClass =
    "h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 shadow-sm focus:border-[#1298E5] focus:outline-none";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-0 bg-slate-50 p-0 shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-0">
          <DialogTitle className="text-2xl font-semibold text-slate-900">
            Add New User
          </DialogTitle>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details to create a new user
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 rounded-3xl bg-slate-50 p-8 pt-4">
            {submitError && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex gap-1 text-xs font-medium text-slate-600">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="flex gap-1 text-xs font-medium text-slate-600">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="flex gap-1 text-xs font-medium text-slate-600">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600">
                  Phone <span className="text-slate-400">(optional)</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative w-28 shrink-0">
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className={selectClass}
                    >
                      <option value="+250">+250</option>
                      <option value="+254">+254</option>
                      <option value="+256">+256</option>
                      <option value="+257">+257</option>
                      <option value="+255">+255</option>
                    </select>
                    <DropdownIcon />
                  </div>
                  <input
                    type="tel"
                    placeholder="788 123 456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex gap-1 text-xs font-medium text-slate-600">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className={selectClass}
                    disabled={rolesLoading}
                  >
                    <option value="">
                      {rolesLoading ? "Loading roles…" : "Select role"}
                    </option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                        
                      </option>
                    ))}
                  </select>
                  <DropdownIcon />
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex gap-1 text-xs font-medium text-slate-600">
                  User Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select user type</option>
                    {USER_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  <DropdownIcon />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="h-11 rounded-full bg-white px-6 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="h-11 rounded-full bg-[#0b4f7a] px-6 text-sm font-medium text-white hover:bg-[#093d5e] disabled:opacity-60"
              >
                {submitLoading ? "Creating…" : "Add User"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ApiUser;
  onSuccess?: () => void;
}) {
  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+250");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [roleId, setRoleId] = useState("");
  const [userType, setUserType] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setEmail(user.email ?? "");
    const raw = user.phone ?? "";
    const matched = raw.match(/^(\+250|\+254|\+256|\+257|\+255)(.*)$/);
    if (matched) {
      setPhoneCountryCode(matched[1]);
      setPhoneNumber(matched[2].trim());
    } else {
      setPhoneCountryCode("+250");
      setPhoneNumber(raw.trim());
    }
    setSubmitError(null);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) return;
    setRolesLoading(true);
    rolesApi
      .list({ limit: 100 }, token)
      .then((res) => {
        if (res.success && res.data) setRoles(Array.isArray(res.data) ? res.data : []);
      })
      .finally(() => setRolesLoading(false));
  }, [open, user.id, user.firstName, user.lastName, user.email, user.phone]);

  function handleClose() {
    onOpenChange(false);
    setSubmitError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      setSubmitError("Not authenticated");
      return;
    }
    setSubmitLoading(true);
    const phone = phoneNumber.trim()
      ? `${phoneCountryCode.replace(/\s/g, "")}${phoneNumber.trim()}`
      : undefined;
    const payload: UpdateUserPayload = {
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      email: email.trim() || undefined,
      phone,
    };
    const res = await usersApi.update(user.id, payload, token);
    setSubmitLoading(false);
    if (!res.success) {
      setSubmitError(res.error ?? "Failed to update user");
      return;
    }
    toast.success("User updated successfully");
    onSuccess?.();
    onOpenChange(false);
  }

  const inputClass =
    "h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-[#1298E5] focus:outline-none";
  const selectClass =
    "h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 shadow-sm focus:border-[#1298E5] focus:outline-none";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-0 bg-slate-50 p-0 shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-0">
          <DialogTitle className="text-2xl font-semibold text-slate-900">
            Edit User
          </DialogTitle>
          <p className="mt-1 text-sm text-slate-500">
            Update the user details
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 rounded-3xl bg-slate-50 p-8 pt-4">
            {submitError && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex gap-1 text-xs font-medium text-slate-600">
                  First Name
                </label>
                <input
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="flex gap-1 text-xs font-medium text-slate-600">
                  Last Name
                </label>
                <input
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600">
                  Phone
                </label>
                <div className="flex gap-2">
                  <div className="relative w-28 shrink-0">
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className={selectClass}
                    >
                      <option value="+250">+250</option>
                      <option value="+254">+254</option>
                      <option value="+256">+256</option>
                      <option value="+257">+257</option>
                      <option value="+255">+255</option>
                    </select>
                    <DropdownIcon />
                  </div>
                  <input
                    type="tel"
                    placeholder="788 123 456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className={selectClass}
                    disabled={rolesLoading}
                  >
                    <option value="">
                      {rolesLoading ? "Loading roles…" : "Select role"}
                    </option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                        {r.description ? ` — ${r.description}` : ""}
                      </option>
                    ))}
                  </select>
                  <DropdownIcon />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600">
                  User Type
                </label>
                <div className="relative">
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select user type</option>
                    {USER_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  <DropdownIcon />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="h-11 rounded-full bg-white px-6 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="h-11 rounded-full bg-[#0b4f7a] px-6 text-sm font-medium text-white hover:bg-[#093d5e] disabled:opacity-60"
              >
                {submitLoading ? "Updating…" : "Update User"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* Dropdown icon */
function DropdownIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function DeactivateUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ApiUser;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate user?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to deactivate{" "}
            <span className="font-medium">
              {user.firstName ?? ""} {user.lastName ?? ""}
            </span>
            ? This user will no longer be able to access the system until
            reactivated.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-amber-600 hover:bg-amber-700"
            onClick={onConfirm}
          >
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ApiUser;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete{" "}
            <span className="font-medium">
              {user.firstName ?? ""} {user.lastName ?? ""}
            </span>
            ? This action cannot be undone and all associated data will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function RowActions({
  user,
  onUserChange,
}: {
  user: ApiUser;
  onUserChange?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  function handleDeactivate() {
    (async () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      const res = await usersApi.update(
        user.id,
        { status: "INACTIVE" },
        token,
      );
      if (!res.success) {
        toast.error(res.error ?? "Failed to deactivate user");
        return;
      }
      toast.success("User deactivated successfully");
      onUserChange?.();
      setDeactivateOpen(false);
    })();
  }

  function handleDelete() {
    (async () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      const res = await usersApi.delete(user.id, token);
      if (!res.success) {
        toast.error(res.error ?? "Failed to delete user");
        return;
      }
      toast.success("User deleted successfully");
      onUserChange?.();
      setDeleteOpen(false);
    })();
  }

  return (
    <div className="relative flex items-center justify-end gap-3 text-slate-500">
      <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100">
        <Eye width={16} height={16} />
      </button>

      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100"
      >
        <MoreVertical width={16} height={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-30 w-40 rounded-xl bg-white text-xs shadow-lg ring-1 ring-slate-900/5">
          <MenuButton
            onClick={() => {
              closeMenu();
              setEditOpen(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5 text-amber-500" />
            Edit
          </MenuButton>

          <MenuButton
            onClick={() => {
              closeMenu();
              setPermissionsOpen(true);
            }}
          >
            <Shield className="h-3.5 w-3.5 text-blue-600" />
            Permissions
          </MenuButton>

          <div className="my-0.5 h-px bg-slate-100" />

          <MenuButton
            className="text-amber-600"
            onClick={() => {
              closeMenu();
              setDeactivateOpen(true);
            }}
          >
            <Lock className="h-3.5 w-3.5 text-amber-500" />
            Deactivate
          </MenuButton>

          <MenuButton
            className="text-red-600"
            onClick={() => {
              closeMenu();
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
            Delete
          </MenuButton>
        </div>
      )}

      {/* Edit user modal */}
      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
        onSuccess={onUserChange}
      />

      {/* Permissions Modal */}
      <PermissionsDialog
        open={permissionsOpen}
        onOpenChange={setPermissionsOpen}
        user={user}
      />

      {/* Deactivate confirmation */}
      <DeactivateUserDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        user={user}
        onConfirm={handleDeactivate}
      />

      {/* Delete confirmation */}
      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={user}
        onConfirm={handleDelete}
      />
    </div>
  );
}

