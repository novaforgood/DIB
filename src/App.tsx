import { useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import  SimpleForm  from "./components/campaign/createCampaign.tsx"

// Define the Campaign type based on the data structure
interface Campaign {
  id?: string | number;
  title: string;
  [key: string]: unknown; // Allow for additional properties
}

// Helper function to get Supabase client (only if env vars are available)
function getSupabaseClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}

function App() {
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

      // Check if environment variables are set
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

      // Handle null/undefined data
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

  // Show loading state
  if (loading) {
    return <div>Loading campaigns...</div>;
  }

  // Show error state
  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>Error: {error}</p>
        <button onClick={getCampaigns}>Retry</button>
      </div>
    );
  }

  // Show empty state
  if (campaigns.length === 0) {
    return <div>No campaigns found.</div>;
  }

  // Render campaigns list
  // Example styled list when campaigns load successfully
  // Comment: outer container uses flexbox to center content on the screen
  return (
    // <div className="min-h-screen flex items-center justify-center">
    //   {/* Comment: remove max-width so it can grow with the screen */}
    //   {/* Comment: inner container holds the text and list; limit width so it's centered nicely */}
    //   <div className="w-full max-w-3xl px-4 flex flex-col items-center">
    //     {/* Comment: add text-center to center the heading text */}
    //     <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">
    //       Campaigns
    //     </h1>

    //     {/* Comment: center the subtitle text as well */}
    //     <p className="text-base md:text-lg text-zinc-400 mb-8 text-center">
    //       {/* Comment: subtitle under header */}
    //       Select a campaign from the list below.
    //     </p>

    //     {/* Comment: center the list under the text */}
    //     <ul className="space-y-4 w-full flex flex-col items-center">
    //       {campaigns.map((campaign) => (
    //         <li
    //           key={campaign.id || campaign.title}
    //           className="flex w-full max-w-md items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4"
    //         >
    //           <span className="text-lg font-medium">{campaign.title}</span>

    //           <button className="px-4 py-2 rounded-full bg-blue-500 text-sm font-semibold text-white hover:bg-blue-600">
    //             View
    //           </button>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>

    <SimpleForm>

    </SimpleForm>
  );
}

export default App;
