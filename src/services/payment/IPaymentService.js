/**
 * Payment Service Interface
 * Following Interface Segregation Principle (ISP) and Dependency Inversion Principle (DIP)
 */
export class IPaymentService {
  /**
   * Initialize the payment service
   * @param {Object} config - Configuration object
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async initialize(_config) {
    throw new Error('initialize method must be implemented');
  }

  /**
   * Process a payment
   * @param {Object} paymentData - Payment information
   * @param {number} paymentData.amount - Amount in cents/smallest currency unit
   * @param {string} paymentData.currency - Currency code (e.g., 'usd')
   * @param {Object} paymentData.metadata - Additional metadata
   * @returns {Promise<Object>} Payment result
   */
  // eslint-disable-next-line no-unused-vars
  async processPayment(_paymentData) {
    throw new Error('processPayment method must be implemented');
  }

  /**
   * Check if the service is initialized
   * @returns {boolean}
   */
  isInitialized() {
    throw new Error('isInitialized method must be implemented');
  }
}

