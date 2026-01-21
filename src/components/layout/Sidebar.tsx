"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 border-r p-4">
      <h2 className="font-bold mb-4">Menu</h2>

      <ul className="space-y-2">
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/users">Users</Link>
        </li>
      </ul>
    </aside>
  );
}
