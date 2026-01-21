import { useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface Campaign {
  id?: string | number;
  title: string;
  [key: string]: unknown;
}

function getSupabaseClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCampaigns();
  }, []);

  async function getCampaigns(): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error(
          "Missing Supabase environment variables. Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY"
        );
      }

      const { data, error: queryError } = await supabase
        .from("campaigns")
        .select();

      if (queryError) {
        throw queryError;
      }

      if (data) {
        setCampaigns(data as Campaign[]);
        console.log("Campaigns loaded:", data);
      } else {
        setCampaigns([]);
        console.log("No campaigns found");
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch campaigns";
      setError(errorMessage);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading campaigns...</div>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>Error: {error}</p>
        <button onClick={getCampaigns}>Retry</button>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return <div>No campaigns found.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl px-4 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">
          Campaigns
        </h1>

        <p className="text-base md:text-lg text-zinc-400 mb-8 text-center">
          Select a campaign from the list below!
        </p>

        <ul className="space-y-4 w-full flex flex-col items-center">
          {campaigns.map((campaign) => (
            <li
              key={campaign.id || campaign.title}
              className="flex w-full max-w-md items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4"
            >
              <span className="text-lg font-medium">{campaign.title}</span>

              <button className="px-4 py-2 rounded-full bg-blue-500 text-sm font-semibold text-white hover:bg-blue-600">
                View
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
