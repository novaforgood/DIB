# Donation Page Setup Guide

This application includes a donation page with Stripe and PayPal integration, following SOLID principles.

## Architecture

The payment system is structured following SOLID principles:

### Single Responsibility Principle (SRP)
- `StripeService`: Handles only Stripe payment processing
- `PayPalService`: Handles only PayPal payment processing
- Each component has a single, well-defined responsibility

### Open/Closed Principle (OCP)
- `IPaymentService`: Base interface that can be extended without modification
- New payment providers can be added by implementing the interface

### Liskov Substitution Principle (LSP)
- `StripeService` and `PayPalService` can be used interchangeably through the `IPaymentService` interface

### Interface Segregation Principle (ISP)
- `IPaymentService` contains only methods relevant to payment processing
- No client is forced to depend on methods it doesn't use

### Dependency Inversion Principle (DIP)
- Components depend on the `IPaymentService` abstraction, not concrete implementations
- `PaymentServiceFactory` creates instances based on configuration

## File Structure

```
src/
├── services/
│   └── payment/
│       ├── IPaymentService.js       # Payment service interface
│       ├── StripeService.js         # Stripe implementation
│       ├── PayPalService.js         # PayPal implementation
│       └── PaymentServiceFactory.js # Factory for creating services
├── components/
│   └── payment/
│       ├── StripePayment.jsx        # Stripe payment UI component
│       └── PayPalPayment.jsx        # PayPal payment UI component
├── pages/
│   └── DonationPage.jsx             # Main donation page
└── styles/
    └── DonationPage.css             # Donation page styles
```

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory (use `.env.example` as a template):

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_PAYPAL_CLIENT_ID=...
```

### 2. Stripe Setup

1. Sign up at [Stripe](https://stripe.com)
2. Get your publishable key from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. Add it to your `.env` file

**Important**: For production, you'll need a backend server to:
- Create PaymentIntents securely (using your secret key)
- Handle webhooks for payment confirmations
- Store donation records

The current implementation includes a mock flow. To make it fully functional:

1. Create a backend endpoint: `POST /api/create-payment-intent`
2. Update `StripePayment.jsx` to call this endpoint
3. Use the returned `clientSecret` to confirm the payment

### 3. PayPal Setup

1. Sign up at [PayPal Developer](https://developer.paypal.com)
2. Create an app in the [PayPal Dashboard](https://developer.paypal.com/dashboard/)
3. Get your Client ID
4. Add it to your `.env` file

PayPal integration works client-side and doesn't require a backend for basic payments.

## Routes

- `/` - Home page with campaigns list
- `/donate` - Donation page with payment options

## Usage

1. Navigate to `/donate`
2. Enter donor information (optional)
3. Select or enter donation amount
4. Choose payment method (Stripe or PayPal)
5. Complete payment

## Production Considerations

### Security
- Never expose secret keys in frontend code
- Always validate payments on the backend
- Use HTTPS in production
- Implement proper error handling and logging

### Backend Requirements
For a production-ready implementation, you'll need:

1. **Stripe Backend**:
   - Endpoint to create PaymentIntents
   - Webhook handler for payment events
   - Database to store donation records

2. **PayPal Backend**:
   - Webhook handler for payment notifications
   - Database to store donation records

3. **General**:
   - User authentication (optional)
   - Donation history
   - Receipt generation
   - Email notifications

## Testing

### Stripe Test Mode
Use Stripe's test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### PayPal Sandbox
Use PayPal's sandbox accounts for testing.

## Extending the System

To add a new payment provider:

1. Create a new service class extending `IPaymentService`
2. Implement all required methods
3. Add the provider to `PaymentServiceFactory`
4. Create a UI component for the provider
5. Add it to `DonationPage.jsx`

Example:
```javascript
// NewPaymentService.js
export class NewPaymentService extends IPaymentService {
  async initialize(config) { /* ... */ }
  async processPayment(paymentData) { /* ... */ }
  isInitialized() { /* ... */ }
}
```

