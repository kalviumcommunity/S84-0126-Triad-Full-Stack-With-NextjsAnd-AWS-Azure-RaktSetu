"use client";

import { useRouter } from "next/navigation";

type Stat = {
  title: string;
  value: string;
  change: string;
  positive: boolean;
};

/* ==============================
   Reusable Tailwind Class Strings
   ============================== */

const primaryButtonClasses =
  "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2";

const secondaryButtonClasses =
  "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2";

const statCardClasses =
  "bg-white p-6 rounded-xl shadow-sm border transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] hover:shadow-xl hover:border-red-200 cursor-pointer";

/* ==============================
   Static Stats Data
   ============================== */

const stats: Stat[] = [
  {
    title: "Total Blood Units",
    value: "264",
    change: "+12% from last month",
    positive: true,
  },
  {
    title: "Registered Donors",
    value: "1,847",
    change: "+8% from last month",
    positive: true,
  },
  {
    title: "Pending Requests",
    value: "23",
    change: "-5% from last month",
    positive: false,
  },
  {
    title: "Donations This Month",
    value: "156",
    change: "+18% from last month",
    positive: true,
  },
];

export default function StatsCards() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      {/* ==============================
          Overview Header
         ============================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
          <p className="text-gray-500 text-sm">
            Monitor blood inventory and requests
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={() => router.push("/requests/new")}
            className={primaryButtonClasses}
          >
            ➕ New Request
          </button>

          <button
            onClick={() => router.push("/donors/register")}
            className={secondaryButtonClasses}
          >
            👤 Register Donor
          </button>

          <button
            onClick={() => router.push("/inventory")}
            className={secondaryButtonClasses}
          >
            🔍 Find Blood
          </button>

          <button
            onClick={() => router.push("/alerts/send")}
            className={secondaryButtonClasses}
          >
            🔔 Send Alert
          </button>
        </div>
      </div>

      {/* ==============================
          Stats Grid
         ============================== */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className={statCardClasses}>
            <p className="text-gray-500 text-sm">{stat.title}</p>
            <h2 className="text-3xl font-bold mt-2 text-black">{stat.value}</h2>
            <p
              className={`mt-2 text-sm font-medium ${
                stat.positive ? "text-green-600" : "text-red-500"
              }`}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
