import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

/**
 * Stripe Payment Component
 * Uses a simplified approach that works without a backend PaymentIntent
 * For production, you should create PaymentIntents on your backend
 */
export default function StripePayment({ amount, currency = 'usd', onSuccess, onError }) {
  const [stripePromise, setStripePromise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initStripe = async () => {
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

      if (!publishableKey) {
        const errorMsg = 'Stripe publishable key not found. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.';
        console.error(errorMsg);
        setError(errorMsg);
        if (onError) onError(new Error(errorMsg));
        setLoading(false);
        return;
      }

      try {
        const stripe = await loadStripe(publishableKey);
        if (!stripe) {
          throw new Error('Failed to load Stripe');
        }
        setStripePromise(stripe);
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        const errorMsg = error.message || 'Failed to initialize Stripe. Please check your configuration.';
        setError(errorMsg);
        if (onError) onError(error);
      } finally {
        setLoading(false);
      }
    };

    initStripe();
  }, [onError]);

  const handlePayment = async () => {
    if (!stripePromise) {
      setError('Stripe is not initialized');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // For a production setup, you would:
      // 1. Create a PaymentIntent on your backend
      // 2. Use stripe.confirmCardPayment() or redirect to Checkout

      // For demo purposes without a backend, we'll simulate the payment
      // In production, replace this with actual Stripe Checkout or PaymentIntent flow

      // Option 1: Use Stripe Checkout (requires backend to create session)
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount, currency })
      // });
      // const { sessionId } = await response.json();
      // const { error } = await stripePromise.redirectToCheckout({ sessionId });

      // Option 2: For demo, simulate successful payment
      // In production, you MUST use one of the secure methods above
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockPaymentIntentId = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      onSuccess({
        provider: 'stripe',
        paymentIntentId: mockPaymentIntentId,
        transactionId: mockPaymentIntentId,
        amount,
        currency,
      });
    } catch (err) {
      const errorMsg = err.message || 'Payment failed';
      setError(errorMsg);
      if (onError) onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading Stripe...</div>;
  }

  if (error && !stripePromise) {
    return (
      <div className="error-message">
        {error}
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          Please check your Stripe configuration in the .env file.
        </p>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="error-message">
        Failed to initialize Stripe. Please check your configuration.
      </div>
    );
  }

  return (
    <div className="stripe-payment-container">
      <div className="stripe-info-box">
        <p style={{ marginBottom: '0.75rem', color: '#666', fontWeight: '500' }}>
          💳 Stripe Payment Demo
        </p>
        <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
          For production use, integrate with your backend to create PaymentIntents securely.
          This demo simulates a successful payment for testing purposes.
        </p>
      </div>
      {error && <div className="error-message">{error}</div>}
      <button
        type="button"
        onClick={handlePayment}
        disabled={isProcessing || !stripePromise}
        className="payment-button"
      >
        {isProcessing ? (
          <>
            <span className="spinner"></span> Processing Payment...
          </>
        ) : (
          `Donate $${(amount / 100).toFixed(2)}`
        )}
      </button>
    </div>
  );
}

