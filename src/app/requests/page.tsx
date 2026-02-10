"use client";

import { useEffect, useState, FormEvent } from "react";

type BloodRequest = {
  id: number;
  bloodGroup: string;
  quantity: number;
  urgency: string;
  note: string | null;
  status: string;
  createdAt: string;
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form state
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState("Normal");
  const [note, setNote] = useState("");

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        setRequests(data.data);
      }
    } catch {
      console.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchRequests();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          bloodGroup,
          quantity,
          urgency,
          note: note || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMessage(data?.message ?? "Failed to submit request");
        return;
      }

      setMessage("Blood request submitted successfully!");
      setBloodGroup("A+");
      setQuantity(1);
      setUrgency("Normal");
      setNote("");
      await fetchRequests();
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Blood Requests</h1>

      {/* Submit Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Submit a Blood Request
        </h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Quantity (units)
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Normal">Normal</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any additional info"
              className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="md:col-span-2">
            {message && (
              <p
                className={`text-sm mb-2 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}
              >
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>

      {/* Requests List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Your Requests
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-400">No blood requests submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Blood Group</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Urgency</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {requests.map((r) => (
                  <tr key={r.id} className="text-gray-700">
                    <td className="px-4 py-3 font-semibold">{r.bloodGroup}</td>
                    <td className="px-4 py-3">{r.quantity} units</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          r.urgency === "Emergency"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {r.urgency}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
