"use client";

import { useEffect, useState } from "react";

type BloodBank = {
  id: number;
  name: string;
  location: string;
  contact: string;
  availableGroups: string | null;
};

export default function BloodBanksPage() {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBloodBanks() {
      try {
        const res = await fetch("/api/blood-banks", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data?.success) {
          setBloodBanks(data.data);
        }
      } catch {
        console.error("Failed to fetch blood banks");
      } finally {
        setLoading(false);
      }
    }
    void fetchBloodBanks();
  }, []);

  return (
    <div className="flex-1 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Blood Banks</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Blood Bank Directory
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : bloodBanks.length === 0 ? (
          <p className="text-gray-400">No blood banks listed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Available Groups</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bloodBanks.map((b) => (
                  <tr key={b.id} className="text-gray-700">
                    <td className="px-4 py-3 font-semibold">{b.name}</td>
                    <td className="px-4 py-3">{b.location}</td>
                    <td className="px-4 py-3">{b.contact}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {b.availableGroups || "—"}
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
