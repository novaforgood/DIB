import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import StripePayment from '../components/payment/StripePayment.jsx';
import PayPalPayment from '../components/payment/PayPalPayment.jsx';
import { donationService } from '../services/donation/DonationService.js';
import '../styles/DonationPage.css';

export default function DonationPage() {
  const [searchParams] = useSearchParams();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [savingDonation, setSavingDonation] = useState(false);

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns();

    // Check for campaign ID in URL params
    const campaignId = searchParams.get('campaign');
    if (campaignId) {
      loadCampaign(parseInt(campaignId));
    }
  }, [searchParams]);

  const loadCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      const data = await donationService.getCampaigns();
      setCampaigns(data);

      // If only one campaign, select it automatically
      if (data.length === 1) {
        setSelectedCampaign(data[0]);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setMessage(`Error loading campaigns: ${error.message}`);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const loadCampaign = async (campaignId) => {
    try {
      const campaign = await donationService.getCampaign(campaignId);
      setSelectedCampaign(campaign);
    } catch (error) {
      console.error('Error loading campaign:', error);
      setMessage(`Error loading campaign: ${error.message}`);
    }
  };

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setAmount('');
  };

  const getFinalAmount = () => {
    if (customAmount) {
      return parseFloat(customAmount) * 100; // Convert to cents
    }
    return parseFloat(amount) * 100; // Convert to cents
  };

  const handlePaymentSuccess = async (result) => {
    try {
      setSavingDonation(true);

      if (!selectedCampaign) {
        throw new Error('Please select a campaign');
      }

      const finalAmount = getFinalAmount();
      const amountInDollars = finalAmount / 100;

      // Create donation record
      const donationData = {
        campaign_id: selectedCampaign.id,
        donor_user_id: null, // TODO: Get from auth context if user is logged in
        donor_name: isAnonymous ? 'Anonymous' : donorName || 'Anonymous',
        donor_email: donorEmail || '',
        amount: amountInDollars,
        currency: 'USD',
        is_anonymous: isAnonymous,
        is_recurring: isRecurring,
        message: message || null,
        payment_status: 'completed',
        payment_gateway_id: result.transactionId || result.paymentIntentId || result.id || 'N/A',
      };

      // Save donation to database
      const donation = await donationService.createDonation(donationData);

      // Update campaign total_raised
      await donationService.updateCampaignTotal(selectedCampaign.id, amountInDollars);

      console.log('Donation saved successfully:', donation);
      setPaymentSuccess(true);
    } catch (error) {
      console.error('Error saving donation:', error);
      setMessage(`Payment succeeded but failed to save donation: ${error.message}`);
      // Still show success since payment went through
      setPaymentSuccess(true);
    } finally {
      setSavingDonation(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setMessage(`Payment failed: ${error.message || 'Unknown error'}`);
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setMessage('');
    setPaymentSuccess(false);
  };

  const resetForm = () => {
    setSelectedProvider(null);
    setAmount('');
    setCustomAmount('');
    setDonorName('');
    setDonorEmail('');
    setIsAnonymous(false);
    setIsRecurring(false);
    setMessage('');
    setPaymentSuccess(false);
  };

  if (paymentSuccess) {
    return (
      <div className="donation-page">
        <nav className="navbar">
          <Link to="/" className="nav-logo">DIB</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/donate" className="nav-link donate-link">Donate</Link>
          </div>
        </nav>
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Thank You for Your Donation!</h2>
          <p>Your donation has been processed successfully.</p>
          <button onClick={resetForm} className="reset-button">
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  const finalAmount = getFinalAmount();
  const isValidAmount = finalAmount > 0 && finalAmount <= 1000000; // Max $10,000

  return (
    <div className="donation-page">
      <nav className="navbar">
        <Link to="/" className="nav-logo">DIB</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/donate" className="nav-link donate-link">Donate</Link>
        </div>
      </nav>
      <div className="donation-container">
        <h1>Make a Donation</h1>
        <p className="subtitle">Your contribution makes a difference</p>

        <div className="donation-form">
          {/* Campaign Selection */}
          <div className="form-section">
            <h3>Select Campaign</h3>
            {loadingCampaigns ? (
              <div className="loading">Loading campaigns...</div>
            ) : campaigns.length === 0 ? (
              <div className="error-text">No campaigns available</div>
            ) : (
              <div className="form-group">
                <label htmlFor="campaign">Choose a campaign</label>
                <select
                  id="campaign"
                  value={selectedCampaign?.id || ''}
                  onChange={(e) => {
                    const campaign = campaigns.find(c => c.id === parseInt(e.target.value));
                    setSelectedCampaign(campaign);
                  }}
                  className="campaign-select"
                >
                  <option value="">Select a campaign...</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.title} {campaign.target_amount ? `($${campaign.target_amount} goal)` : ''}
                    </option>
                  ))}
                </select>
                {selectedCampaign && (
                  <div className="campaign-info">
                    <p className="campaign-description">{selectedCampaign.description}</p>
                    {selectedCampaign.target_amount && (
                      <p className="campaign-progress">
                        Raised: ${selectedCampaign.total_raised || 0} / ${selectedCampaign.target_amount}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Donor Information */}
          <div className="form-section">
            <h3>Your Information</h3>
            <div className="form-group">
              <label htmlFor="donorName">Name {isAnonymous ? '(Hidden)' : '(Optional)'}</label>
              <input
                type="text"
                id="donorName"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Enter your name"
                disabled={isAnonymous}
              />
            </div>
            <div className="form-group">
              <label htmlFor="donorEmail">Email (Optional)</label>
              <input
                type="email"
                id="donorEmail"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span>Make this donation anonymous</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                <span>Make this a recurring donation</span>
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to your donation"
                rows="3"
                className="message-textarea"
              />
            </div>
          </div>

          {/* Amount Selection */}
          <div className="form-section">
            <h3>Select Amount</h3>
            <div className="amount-buttons">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`amount-button ${amount === preset.toString() ? 'active' : ''}`}
                  onClick={() => handleAmountSelect(preset.toString())}
                >
                  ${preset}
                </button>
              ))}
            </div>
            <div className="form-group">
              <label htmlFor="customAmount">Or enter custom amount</label>
              <input
                type="number"
                id="customAmount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="0.00"
                min="1"
                step="0.01"
              />
            </div>
            {!isValidAmount && (amount || customAmount) && (
              <p className="error-text">Please enter a valid amount (max $10,000)</p>
            )}
          </div>

          {/* Payment Provider Selection */}
          {isValidAmount && selectedCampaign && (
            <div className="form-section">
              <h3>Choose Payment Method</h3>
              <div className="provider-buttons">
                <button
                  type="button"
                  className={`provider-button ${selectedProvider === 'stripe' ? 'active' : ''}`}
                  onClick={() => handleProviderSelect('stripe')}
                >
                  <span className="provider-icon">💳</span>
                  Stripe
                </button>
                <button
                  type="button"
                  className={`provider-button ${selectedProvider === 'paypal' ? 'active' : ''}`}
                  onClick={() => handleProviderSelect('paypal')}
                >
                  <span className="provider-icon">🅿️</span>
                  PayPal
                </button>
              </div>
            </div>
          )}

          {/* Payment Component */}
          {selectedProvider && isValidAmount && selectedCampaign && (
            <div className="form-section payment-section">
              <h3>Complete Your Donation</h3>
              {message && (
                <div className={`message ${message.includes('failed') || message.includes('Error') ? 'error' : 'success'}`}>
                  {message}
                </div>
              )}
              {savingDonation && (
                <div className="saving-indicator">Saving your donation...</div>
              )}

              {selectedProvider === 'stripe' && (
                <StripePayment
                  amount={finalAmount}
                  currency="usd"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              {selectedProvider === 'paypal' && (
                <PayPalPayment
                  amount={finalAmount}
                  currency="USD"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}
            </div>
          )}

          {isValidAmount && !selectedCampaign && (
            <div className="form-section">
              <p className="error-text">Please select a campaign to continue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

