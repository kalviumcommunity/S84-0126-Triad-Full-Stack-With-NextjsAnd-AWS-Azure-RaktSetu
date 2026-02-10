"use client";
import { useRouter, usePathname } from "next/navigation";
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
import { ReactNode } from "react";
import Image from "next/image";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  path: string;
}

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-white border-r p-5 flex flex-col justify-between">
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
            path="/dashboard"
          />
          <SidebarItem
            icon={<Droplet size={18} />}
            label="Blood Inventory"
            path="/dashboard/inventory"
          />
          <SidebarItem
            icon={<Users size={18} />}
            label="Donors"
            path="/dashboard/donors"
          />
          <SidebarItem
            icon={<FileText size={18} />}
            label="Requests"
            path="/dashboard/requests"
          />
          <SidebarItem
            icon={<Calendar size={18} />}
            label="Appointments"
            path="/dashboard/appointments"
          />

          <p className="text-xs text-gray-400 mt-6 mb-2">Management</p>

          <SidebarItem
            icon={<Building2 size={18} />}
            label="Blood Banks"
            path="/blood-banks"
          />
          <SidebarItem
            icon={<Megaphone size={18} />}
            label="Campaigns"
            path="/campaigns"
          />
          <SidebarItem
            icon={<Settings size={18} />}
            label="Settings"
            path="/settings"
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

function SidebarItem({ icon, label, path }: SidebarItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const active = pathname === path;

  return (
    <div
      onClick={() => router.push(path)}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
        active
          ? "bg-red-50 text-red-600 font-semibold"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}
