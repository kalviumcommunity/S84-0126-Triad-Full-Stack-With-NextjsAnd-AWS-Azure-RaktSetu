"use client";

import { useEffect, useState } from "react";

type Campaign = {
  id: number;
  title: string;
  date: string;
  location: string;
  organizer: string;
  createdAt: string;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch("/api/campaigns", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data?.success) {
          setCampaigns(data.data);
        }
      } catch {
        console.error("Failed to fetch campaigns");
      } finally {
        setLoading(false);
      }
    }
    void fetchCampaigns();
  }, []);

  return (
    <div className="flex-1 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Campaigns</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Blood Donation Campaigns
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-gray-400">No campaigns available at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-800 mb-2">{c.title}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Date:</span> {c.date}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {c.location}
                  </p>
                  <p>
                    <span className="font-medium">Organizer:</span>{" "}
                    {c.organizer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
