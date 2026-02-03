import Topbar from "@/components/dashboard/Topbar";
import StatsCards from "@/components/dashboard/StatsCards";
import BloodInventory from "@/components/dashboard/BloodInventory";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <div className="flex-1 p-6 space-y-6">
        <Topbar />
        <StatsCards />
        <BloodInventory />
      </div>
    </div>
  );
}
