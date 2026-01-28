import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DonationPage from './pages/DonationPage.jsx';
import { donationService } from './services/donation/DonationService.js';
import './App.css';

function HomePage() {
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

      const data = await donationService.getCampaigns();
      setCampaigns(data);
      console.log("Campaigns loaded:", data);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError(err.message || "Failed to fetch campaigns");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home-page">
      <nav className="navbar">
        <Link to="/" className="nav-logo">DIB</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/donate" className="nav-link donate-link">Donate</Link>
        </div>
      </nav>

      <div className="home-content">
        <h1>Welcome to DIB</h1>

        {loading && <div>Loading campaigns...</div>}

        {error && (
          <div className="error-container">
            <p style={{ color: "red" }}>Error: {error}</p>
            <button onClick={getCampaigns}>Retry</button>
          </div>
        )}

        {!loading && !error && campaigns.length === 0 && (
          <div>No campaigns found.</div>
        )}

        {!loading && !error && campaigns.length > 0 && (
          <ul className="campaigns-list">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="campaign-item">
                <Link to={`/donate?campaign=${campaign.id}`} className="campaign-link">
                  <h3>{campaign.title}</h3>
                  {campaign.description && <p className="campaign-preview">{campaign.description.substring(0, 150)}...</p>}
                  {campaign.target_amount && (
                    <div className="campaign-stats">
                      <span>Raised: ${campaign.total_raised || 0}</span>
                      <span>Goal: ${campaign.target_amount}</span>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="cta-section">
          <h2>Make a Difference</h2>
          <p>Your support helps us continue our mission</p>
          <Link to="/donate" className="cta-button">
            Donate Now
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/donate" element={<DonationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
