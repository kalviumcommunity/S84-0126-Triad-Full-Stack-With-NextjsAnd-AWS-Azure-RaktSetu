export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600">Total Donors</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">120</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600">Blood Requests</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">45</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600">Available Units</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">78</p>
        </div>
      </div>
    </div>
  );
}
