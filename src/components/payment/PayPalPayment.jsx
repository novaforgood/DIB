import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';

export default function PayPalPayment({ amount, currency = 'USD', onSuccess, onError }) {
  const [error, setError] = useState(null);

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (amount / 100).toFixed(2), // Convert cents to dollars
            currency_code: currency,
          },
          description: 'Donation',
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture();
      
      if (onSuccess) {
        onSuccess({
          provider: 'paypal',
          transactionId: order.id,
          amount: amount,
          currency: currency,
          details: order,
        });
      }
    } catch (err) {
      const errorMessage = err.message || 'Payment failed';
      setError(errorMessage);
      if (onError) onError(err);
    }
  };

  const onErrorHandler = (err) => {
    setError(err.message || 'An error occurred with PayPal');
    if (onError) onError(err);
  };

  return (
    <div className="paypal-payment-container">
      <PayPalScriptProvider
        options={{
          clientId: clientId,
          currency: currency,
          intent: 'capture',
        }}
      >
        {error && <div className="error-message">{error}</div>}
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onErrorHandler}
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'donate',
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}

