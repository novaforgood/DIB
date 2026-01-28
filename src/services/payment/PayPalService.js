import { IPaymentService } from './IPaymentService.js';

/**
 * PayPal Payment Service Implementation
 * Following Single Responsibility Principle (SRP) - handles only PayPal payments
 */
export class PayPalService extends IPaymentService {
  constructor() {
    super();
    this.clientId = null;
    this.initialized = false;
    this.paypal = null;
  }

  /**
   * Initialize PayPal with client ID
   * @param {Object} config
   * @param {string} config.clientId - PayPal client ID
   */
  async initialize(config) {
    if (!config?.clientId) {
      throw new Error('PayPal client ID is required');
    }

    this.clientId = config.clientId;
    this.initialized = true;
  }

  /**
   * Process payment using PayPal
   * @param {Object} paymentData
   * @param {number} paymentData.amount - Amount in dollars (or currency unit)
   * @param {string} paymentData.currency - Currency code
   * @param {Object} paymentData.metadata - Additional metadata
   * @returns {Promise<Object>}
   */
  async processPayment(paymentData) {
    if (!this.isInitialized()) {
      throw new Error('PayPal service is not initialized');
    }

    const { amount, currency = 'USD' } = paymentData;

    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    // PayPal integration is typically handled through their SDK components
    // The actual payment processing happens in the PayPal button component
    // This method is here for consistency with the interface
    
    return {
      success: true,
      provider: 'paypal',
      message: 'PayPal payment initiated',
      amount,
      currency,
    };
  }

  /**
   * Get PayPal configuration for SDK
   */
  getConfig() {
    if (!this.isInitialized()) {
      throw new Error('PayPal service is not initialized');
    }

    return {
      clientId: this.clientId,
      currency: 'USD',
    };
  }

  isInitialized() {
    return this.initialized && this.clientId !== null;
  }

  /**
   * Get PayPal client ID
   */
  getClientId() {
    return this.clientId;
  }
}

