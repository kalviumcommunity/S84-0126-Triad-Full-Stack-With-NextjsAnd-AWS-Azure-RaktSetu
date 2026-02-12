"use client";

import { usePathname } from "next/navigation";
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
}

const navItems = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
    href: "/dashboard",
  },
  { icon: <Droplet size={18} />, label: "Blood Inventory", href: "/inventory" },
  { icon: <Users size={18} />, label: "Donors", href: "/users" },
  { icon: <FileText size={18} />, label: "Requests", href: "/requests" },
  {
    icon: <Calendar size={18} />,
    label: "Appointments",
    href: "/appointments",
  },
];

const managementItems = [
  { icon: <Building2 size={18} />, label: "Blood Banks", href: "/blood-banks" },
  { icon: <Megaphone size={18} />, label: "Campaigns", href: "/campaigns" },
  { icon: <Settings size={18} />, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

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
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}

          <p className="text-xs text-gray-400 mt-6 mb-2">Management</p>

          {managementItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
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

function SidebarItem({
  icon,
  label,
  href,
  active = false,
}: SidebarItemProps & { active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
        active
          ? "bg-red-50 text-red-600 font-semibold"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
