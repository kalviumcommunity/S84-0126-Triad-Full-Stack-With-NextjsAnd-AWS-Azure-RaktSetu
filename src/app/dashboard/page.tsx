import StatsCards from "@/components/dashboard/StatsCards";
import BloodInventory from "@/components/dashboard/BloodInventory";
import DashboardDetails from "@/components/dashboard/DashboardDetails";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <div className="flex-1 p-6 space-y-6">
        <StatsCards />
        <BloodInventory />
        <DashboardDetails />
      </div>
    </div>
  );
}
