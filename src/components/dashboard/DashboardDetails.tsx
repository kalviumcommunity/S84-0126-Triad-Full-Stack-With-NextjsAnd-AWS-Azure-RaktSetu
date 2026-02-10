import {
  Droplet,
  AlertTriangle,
  UserPlus,
  CheckCircle,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";
import { ReactNode } from "react";

export default function DashboardDetails() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-500">
              Latest updates from the network
            </p>
          </div>
          <button className="text-red-600 text-sm font-medium hover:underline">
            View all
          </button>
        </div>

        <div className="space-y-5">
          <ActivityItem
            icon={<Droplet className="text-red-500" />}
            bg="bg-red-100"
            title="Blood Donation Completed"
            desc="Rahul Sharma donated 450ml of A+ blood"
            time="2 hours ago"
          />

          <ActivityItem
            icon={<AlertTriangle className="text-yellow-600" />}
            bg="bg-yellow-100"
            title="Urgent Request Received"
            desc="City Hospital needs 3 units of O- blood"
            time="3 hours ago"
          />

          <ActivityItem
            icon={<UserPlus className="text-green-600" />}
            bg="bg-green-100"
            title="New Donor Registered"
            desc="Priya Patel joined as a B+ donor"
            time="5 hours ago"
          />

          <ActivityItem
            icon={<CheckCircle className="text-blue-600" />}
            bg="bg-blue-100"
            title="Request Fulfilled"
            desc="2 units of AB+ sent to Metro Hospital"
            time="6 hours ago"
          />

          <ActivityItem
            icon={<Droplet className="text-red-500" />}
            bg="bg-red-100"
            title="Blood Donation Completed"
            desc="Amit Kumar donated 450ml of O+ blood"
            time="8 hours ago"
          />
        </div>
      </div>

      {/* ================= PENDING REQUESTS ================= */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Requests
            </h3>
            <p className="text-sm text-gray-500">
              Blood requests awaiting fulfillment
            </p>
          </div>
          <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
            3 pending
          </span>
        </div>

        <div className="space-y-5">
          <RequestCard
            blood="O-"
            units="3 units needed"
            hospital="City General Hospital"
            location="Mumbai, Maharashtra"
            time="30 mins ago"
            phone="+91 98765 43210"
            status="Critical"
          />
          <RequestCard
            blood="B+"
            units="2 units needed"
            hospital="Apollo Hospital"
            location="Delhi, NCR"
            time="2 hours ago"
            phone="+91 87654 32109"
            status="Urgent"
          />
          <RequestCard
            blood="A+"
            units="1 unit needed"
            hospital="Max Healthcare"
            location="Pune, Maharashtra"
            time="5 hours ago"
            phone="+91 76543 21098"
            status="Normal"
          />
        </div>
      </div>
    </div>
  );
}

/* ================= TYPES ================= */

type ActivityItemProps = {
  icon: ReactNode;
  bg: string;
  title: string;
  desc: string;
  time: string;
};

type RequestStatus = "Critical" | "Urgent" | "Normal";

type RequestCardProps = {
  blood: string;
  units: string;
  hospital: string;
  location: string;
  time: string;
  phone: string;
  status: RequestStatus;
};

/* ================= SUB COMPONENTS ================= */

function ActivityItem({ icon, bg, title, desc, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
      <div className="flex-1">
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
    </div>
  );
}

function RequestCard({
  blood,
  units,
  hospital,
  location,
  time,
  phone,
  status,
}: RequestCardProps) {
  const statusColor =
    status === "Critical"
      ? "bg-red-100 text-red-600"
      : status === "Urgent"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-blue-100 text-blue-600";

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold">
            {blood}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{units}</p>
            <p className="text-sm text-gray-500">{hospital}</p>
          </div>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full ${statusColor}`}>
          {status}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {location}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} /> {time}
        </span>
        <span className="flex items-center gap-1">
          <Phone size={14} /> {phone}
        </span>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition">
          Fulfill Request
        </button>
        <button className="px-4 py-2 border rounded-lg text-sm font-medium text-black hover:bg-gray-50">
          View Details
        </button>
      </div>
    </div>
  );
}
