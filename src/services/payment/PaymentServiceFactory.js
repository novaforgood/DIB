import { StripeService } from './StripeService.js';
import { PayPalService } from './PayPalService.js';

/**
 * Payment Service Factory
 * Following Factory Pattern and Dependency Inversion Principle (DIP)
 */
export class PaymentServiceFactory {
  /**
   * Create a payment service instance
   * @param {string} provider - 'stripe' or 'paypal'
   * @param {Object} _config - Configuration for the service
   * @returns {IPaymentService}
   */
  // eslint-disable-next-line no-unused-vars
  static create(provider, _config) {
    switch (provider.toLowerCase()) {
      case 'stripe':
        return new StripeService();
      case 'paypal':
        return new PayPalService();
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }

  /**
   * Get available payment providers
   * @returns {string[]}
   */
  static getAvailableProviders() {
    return ['stripe', 'paypal'];
  }
}

