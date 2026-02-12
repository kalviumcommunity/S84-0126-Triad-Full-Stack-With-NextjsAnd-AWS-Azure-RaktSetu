"use client";

import {
  LayoutDashboard,
  Droplet,
  Users,
  FileText,
  Calendar,
  Building2,
  Megaphone,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

/* =============================
   Reusable Tailwind Classes
   ============================= */

const sidebarContainerClasses =
  "w-64 h-screen sticky top-0 bg-white border-r p-5 flex flex-col justify-between";

const sidebarItemBaseClasses =
  "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition";

const sidebarItemActiveClasses = "bg-red-50 text-red-600 font-semibold";

const sidebarItemInactiveClasses = "hover:bg-gray-100 text-gray-700";

export default function Sidebar() {
  return (
    <aside className={sidebarContainerClasses}>
      <div>
        <div className="flex items-center gap-3 mb-8 px-1">
          <Image
            src="/blood-donate.png"
            alt="RaktSetu Logo"
            width={36}
            height={36}
            className="object-contain"
          />
          <h1 className="text-2xl font-bold text-red-600 tracking-wide">
            RaktSetu
          </h1>
        </div>

        <nav className="space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            href="/dashboard"
            active
          />
          <SidebarItem
            icon={<Droplet size={18} />}
            label="Blood Inventory"
            href="/inventory"
          />
          <SidebarItem
            icon={<Users size={18} />}
            label="Donors"
            href="/users"
          />
          <SidebarItem
            icon={<FileText size={18} />}
            label="Requests"
            href="/requests"
          />
          <SidebarItem
            icon={<Calendar size={18} />}
            label="Appointments"
            href="/appointments"
          />

          <p className="text-xs text-gray-400 mt-6 mb-2">Management</p>

          <SidebarItem
            icon={<Building2 size={18} />}
            label="Blood Banks"
            href="/blood-banks"
          />
          <SidebarItem
            icon={<Megaphone size={18} />}
            label="Campaigns"
            href="/campaigns"
          />
          <SidebarItem
            icon={<Settings size={18} />}
            label="Settings"
            href="/settings"
          />
        </nav>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
        <div className="bg-red-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold">
          AD
        </div>
        <div>
          <p className="font-semibold text-sm">Admin User</p>
          <p className="text-xs text-gray-500">admin@raktsetu.org</p>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, href, active = false }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`${sidebarItemBaseClasses} ${
        active ? sidebarItemActiveClasses : sidebarItemInactiveClasses
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
