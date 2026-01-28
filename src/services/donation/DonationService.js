import { createClient } from '@supabase/supabase-js';

/**
 * Donation Service
 * Handles donation-related database operations following Single Responsibility Principle
 */
export class DonationService {
  constructor() {
    this.supabase = null;
    this.initialize();
  }

  initialize() {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    if (url && key) {
      this.supabase = createClient(url, key);
    }
  }

  /**
   * Create a donation record in the database
   * @param {Object} donationData - Donation data matching the database schema
   * @param {number} donationData.campaign_id - Campaign ID
   * @param {number|null} donationData.donor_user_id - User ID (null for guest donations)
   * @param {string} donationData.donor_name - Donor name
   * @param {string} donationData.donor_email - Donor email
   * @param {number} donationData.amount - Donation amount
   * @param {string} donationData.currency - Currency code
   * @param {boolean} donationData.is_anonymous - Whether donation is anonymous
   * @param {boolean} donationData.is_recurring - Whether donation is recurring
   * @param {string|null} donationData.message - Optional message from donor
   * @param {string} donationData.payment_status - Payment status (pending, completed, failed, refunded)
   * @param {string} donationData.payment_gateway_id - Transaction ID from payment gateway
   * @returns {Promise<Object>} Created donation record
   */
  async createDonation(donationData) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.');
    }

    try {
      const { data, error } = await this.supabase
        .from('donations')
        .insert([
          {
            campaign_id: donationData.campaign_id,
            donor_user_id: donationData.donor_user_id || null,
            donor_name: donationData.donor_name,
            donor_email: donationData.donor_email,
            amount: donationData.amount,
            donation_amount: donationData.amount, // Both fields as per schema
            currency: donationData.currency,
            is_anonymous: donationData.is_anonymous || false,
            is_recurring: donationData.is_recurring || false,
            message: donationData.message || null,
            payment_status: donationData.payment_status || 'pending',
            payment_gateway_id: donationData.payment_gateway_id || null,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating donation:', error);
      throw new Error(`Failed to create donation: ${error.message}`);
    }
  }

  /**
   * Update donation payment status
   * @param {number} donationId - Donation ID
   * @param {string} paymentStatus - New payment status
   * @param {string} paymentGatewayId - Payment gateway transaction ID
   * @returns {Promise<Object>} Updated donation record
   */
  async updateDonationStatus(donationId, paymentStatus, paymentGatewayId) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized.');
    }

    try {
      const { data, error } = await this.supabase
        .from('donations')
        .update({
          payment_status: paymentStatus,
          payment_gateway_id: paymentGatewayId,
        })
        .eq('id', donationId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating donation status:', error);
      throw new Error(`Failed to update donation status: ${error.message}`);
    }
  }

  /**
   * Update campaign total_raised amount
   * @param {number} campaignId - Campaign ID
   * @param {number} amount - Amount to add to total_raised
   * @returns {Promise<Object>} Updated campaign record
   */
  async updateCampaignTotal(campaignId, amount) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized.');
    }

    try {
      // First, get current total_raised
      const { data: campaign, error: fetchError } = await this.supabase
        .from('campaigns')
        .select('total_raised')
        .eq('id', campaignId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const newTotal = (parseFloat(campaign.total_raised) || 0) + parseFloat(amount);

      // Update the campaign
      const { data, error } = await this.supabase
        .from('campaigns')
        .update({
          total_raised: newTotal,
          updated_at: new Date().toISOString(),
        })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating campaign total:', error);
      throw new Error(`Failed to update campaign total: ${error.message}`);
    }
  }

  /**
   * Get donations for a specific campaign
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Array>} Array of donation records
   */
  async getCampaignDonations(campaignId) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized.');
    }

    try {
      const { data, error } = await this.supabase
        .from('donations')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching campaign donations:', error);
      throw new Error(`Failed to fetch donations: ${error.message}`);
    }
  }

  /**
   * Get a campaign by ID
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Object>} Campaign record
   */
  async getCampaign(campaignId) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized.');
    }

    try {
      const { data, error } = await this.supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw new Error(`Failed to fetch campaign: ${error.message}`);
    }
  }

  /**
   * Get all campaigns
   * @returns {Promise<Array>} Array of campaign records
   */
  async getCampaigns() {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized.');
    }

    try {
      const { data, error } = await this.supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw new Error(`Failed to fetch campaigns: ${error.message}`);
    }
  }
}

// Export singleton instance
export const donationService = new DonationService();

