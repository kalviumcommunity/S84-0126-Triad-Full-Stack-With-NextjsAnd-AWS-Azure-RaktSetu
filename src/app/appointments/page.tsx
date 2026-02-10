"use client";

import { useEffect, useState, FormEvent } from "react";

type Appointment = {
  id: number;
  date: string;
  time: string;
  location: string;
  status: string;
  createdAt: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  async function fetchAppointments() {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        setAppointments(data.data);
      }
    } catch {
      console.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchAppointments();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ date, time, location }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMessage(data?.message ?? "Failed to book appointment");
        return;
      }

      setMessage("Appointment booked successfully!");
      setDate("");
      setTime("");
      setLocation("");
      await fetchAppointments();
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>

      {/* Booking Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Book an Appointment
        </h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Location / Center
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. City Blood Bank"
              className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="md:col-span-3">
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
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>

      {/* Appointments List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Your Appointments
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-400">No appointments booked yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map((a) => (
                  <tr key={a.id} className="text-gray-700">
                    <td className="px-4 py-3">{a.date}</td>
                    <td className="px-4 py-3">{a.time}</td>
                    <td className="px-4 py-3">{a.location}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        {a.status}
                      </span>
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
