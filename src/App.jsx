import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Helper function to get Supabase client (only if env vars are available)
function getSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  if (!url || !key) {
    return null;
  }
  
  return createClient(url, key);
}

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCampaigns();
  }, []);

  async function getCampaigns() {
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
        .from("Campaigns")
        .select();

      if (queryError) {
        throw queryError;
      }

      // Handle null/undefined data
      if (data) {
        setCampaigns(data);
        console.log("Campaigns loaded:", data);
      } else {
        setCampaigns([]);
        console.log("No campaigns found");
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError(err.message || "Failed to fetch campaigns");
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
  return (
    <ul>
      {campaigns.map((campaign) => (
        <li key={campaign.id || campaign.name}>{campaign.name}</li>
      ))}
    </ul>
  );
}

export default App;