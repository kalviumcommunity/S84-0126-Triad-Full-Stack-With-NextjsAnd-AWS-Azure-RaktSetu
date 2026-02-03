interface BloodCardProps {
  type: string;
  stock: number;
  total: number;
  status: string;
}

export default function BloodInventory() {
  const bloodData: BloodCardProps[] = [
    { type: "A+", stock: 45, total: 100, status: "Adequate" },
    { type: "A-", stock: 12, total: 50, status: "Low" },
    { type: "B+", stock: 67, total: 100, status: "Good" },
    { type: "B-", stock: 8, total: 50, status: "Critical" },
    { type: "AB+", stock: 23, total: 50, status: "Adequate" },
    { type: "AB-", stock: 5, total: 30, status: "Critical" },
    { type: "O+", stock: 89, total: 120, status: "Good" },
    { type: "O-", stock: 15, total: 60, status: "Low" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-xl font-semibold text-black mb-1">Blood Inventory</h3>
      <p className="text-gray-500 text-sm mb-6">Current stock by blood type</p>

      <div className="grid md:grid-cols-4 gap-5">
        {bloodData.map((blood) => (
          <BloodCard key={blood.type} {...blood} />
        ))}
      </div>
    </div>
  );
}

function BloodCard({ type, stock, total, status }: BloodCardProps) {
  const percent = (stock / total) * 100;

  const statusColor =
    status === "Good"
      ? "bg-green-100 text-green-600"
      : status === "Low"
        ? "bg-yellow-100 text-yellow-600"
        : status === "Critical"
          ? "bg-red-100 text-red-600"
          : "bg-blue-100 text-blue-600";

  return (
    <div className="border p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-bold">{type}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
          {status}
        </span>
      </div>

      <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
        <div
          className="bg-red-500 h-2 rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-600">
        {stock} / {total} units
      </p>
    </div>
  );
}
