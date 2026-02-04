"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

type AdminStats = {
  message: string;
  currentUser: {
    email: string | null;
    role: string | null;
  };
  stats: {
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
  };
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [usersMessage, setUsersMessage] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  useEffect(() => {
    void fetchUsers();
  }, []);

  async function getToken(): Promise<string | null> {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("token");
  }

  async function fetchUsers() {
    setLoadingUsers(true);
    setUsersMessage(null);

    try {
      const token = await getToken();
      if (!token) {
        setUsersMessage("Please log in to view users.");
        return;
      }

      const res = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        if (res.status === 401) {
          setUsersMessage(data?.message ?? "Unauthorized. Please log in.");
        } else if (res.status === 403) {
          setUsersMessage(
            data?.message ?? "You are not allowed to access this resource."
          );
        } else {
          setUsersMessage(data?.message ?? "Failed to load users.");
        }
        return;
      }

      setUsers(data.data ?? []);
    } catch {
      setUsersMessage("Something went wrong while fetching users.");
    } finally {
      setLoadingUsers(false);
    }
  }

  async function fetchAdmin() {
    setLoadingAdmin(true);
    setAdminMessage(null);
    setAdminStats(null);

    try {
      const token = await getToken();
      if (!token) {
        setAdminMessage("Please log in as an admin to view admin data.");
        return;
      }

      const res = await fetch("/api/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        if (res.status === 401) {
          setAdminMessage(data?.message ?? "Unauthorized. Please log in.");
        } else if (res.status === 403) {
          setAdminMessage(
            data?.message ?? "Access denied. Admin role is required."
          );
        } else {
          setAdminMessage(data?.message ?? "Failed to load admin data.");
        }
        return;
      }

      setAdminStats(data.data as AdminStats);
    } catch {
      setAdminMessage("Something went wrong while fetching admin data.");
    } finally {
      setLoadingAdmin(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-8 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Users (Protected)
            </h1>
            <button
              onClick={fetchUsers}
              disabled={loadingUsers}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loadingUsers ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {usersMessage && (
            <p className="text-sm text-red-600 mb-3">{usersMessage}</p>
          )}

          {users.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">ID: {user.id}</span>
                </li>
              ))}
            </ul>
          ) : (
            !usersMessage && (
              <p className="text-sm text-gray-500">
                No users to display. Try refreshing.
              </p>
            )
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Admin Data (Admin Only)
            </h2>
            <button
              onClick={fetchAdmin}
              disabled={loadingAdmin}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loadingAdmin ? "Loading..." : "Load Admin Data"}
            </button>
          </div>

          {adminMessage && (
            <p className="text-sm text-red-600 mb-3">{adminMessage}</p>
          )}

          {adminStats && (
            <div className="space-y-2 text-sm text-gray-700">
              <p className="font-medium">{adminStats.message}</p>
              <p>
                Current user:{" "}
                <span className="font-mono">
                  {adminStats.currentUser.email ?? "unknown"} (
                  {adminStats.currentUser.role ?? "unknown"})
                </span>
              </p>
              <p>
                Total users:{" "}
                <span className="font-semibold">
                  {adminStats.stats.totalUsers}
                </span>
              </p>
              <p>
                Admins:{" "}
                <span className="font-semibold">
                  {adminStats.stats.adminUsers}
                </span>{" "}
                | Regular users:{" "}
                <span className="font-semibold">
                  {adminStats.stats.regularUsers}
                </span>
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
