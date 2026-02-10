import { Search, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <div className=" sticky top-0 z-50 bg-white px-8 py-5 shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900">Dashboard</h3>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <div className="flex items-center bg-gray-50 px-4 py-2.5 rounded-xl border w-96 focus-within:ring-2 focus-within:ring-red-200 transition">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search donors, requests..."
              className="outline-none w-full text-gray-700 text-sm bg-transparent"
            />
          </div>

          {/* Notification */}
          <button className="relative p-2.5 bg-white text-gray-500 rounded-xl border hover:bg-gray-50 transition">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
              3
            </span>
          </button>

          {/* Avatar */}
          <div className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shadow-sm">
            AD
          </div>
        </div>
      </div>
    </div>
  );
}
