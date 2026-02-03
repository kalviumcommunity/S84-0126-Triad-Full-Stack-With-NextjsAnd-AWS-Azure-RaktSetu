import { Search, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl text-black font-bold">Dashboard</h2>
        <p className="text-gray-600 text-sm">Welcome back, Admin</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-white px-3 py-2 rounded-lg border w-80">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search donors, requests..."
            className="outline-none w-full text-gray-600 text-sm"
          />
        </div>

        <button className="relative p-2 bg-white text-gray-400 rounded-lg border">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>

        <div className="bg-red-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold">
          AD
        </div>
      </div>
    </div>
  );
}
