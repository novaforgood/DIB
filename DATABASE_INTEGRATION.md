# Database Integration Guide

This document explains how the donation page integrates with your database schema.

## Database Schema

The application integrates with the following tables:

### `users`
- Stores user information
- Fields: `id`, `name`, `email`, `password_hash`, `avatar_url`, `stripe_customer_id`, `created_at`, `updated_at`

### `campaigns`
- Stores fundraising campaigns
- Fields: `id`, `owner_user_id`, `campaign_url`, `title`, `description`, `cover_image_url`, `target_amount`, `total_raised`, `currency`, `status`, `salesforce_campaign_id`, `end_date`, `created_at`, `updated_at`

### `donations`
- Stores donation records
- Fields: `id`, `campaign_id`, `donor_user_id`, `donor_name`, `donor_email`, `amount`, `donation_amount`, `currency`, `is_anonymous`, `is_recurring`, `message`, `payment_status`, `payment_gateway_id`, `salesforce_donation_id`, `created_at`

## Integration Points

### 1. DonationService (`src/services/donation/DonationService.js`)

This service handles all database operations for donations:

- **`createDonation(donationData)`**: Creates a new donation record
- **`updateDonationStatus(donationId, paymentStatus, paymentGatewayId)`**: Updates payment status after payment confirmation
- **`updateCampaignTotal(campaignId, amount)`**: Updates the `total_raised` field in campaigns table
- **`getCampaign(campaignId)`**: Fetches a single campaign
- **`getCampaigns()`**: Fetches all campaigns
- **`getCampaignDonations(campaignId)`**: Fetches all donations for a campaign

### 2. Donation Flow

When a user completes a donation:

1. User selects a campaign
2. User enters donation details (name, email, amount, message, etc.)
3. User chooses payment method (Stripe or PayPal)
4. Payment is processed
5. On successful payment:
   - Donation record is created in `donations` table
   - Campaign's `total_raised` is updated
   - Success message is displayed

### 3. Data Mapping

The donation form maps to the database schema as follows:

| Form Field | Database Field | Notes |
|------------|---------------|-------|
| Campaign selection | `campaign_id` | Required |
| Donor name | `donor_name` | Required (defaults to "Anonymous" if empty) |
| Donor email | `donor_email` | Optional |
| Anonymous checkbox | `is_anonymous` | Boolean |
| Recurring checkbox | `is_recurring` | Boolean |
| Message | `message` | Optional text field |
| Amount | `amount` and `donation_amount` | Both fields set to same value |
| Payment provider | `payment_gateway_id` | Transaction ID from Stripe/PayPal |
| Payment status | `payment_status` | Set to "completed" on success |

### 4. Campaign Selection

Campaigns can be selected in two ways:

1. **From URL parameter**: `/donate?campaign=123`
2. **From dropdown**: User selects from available campaigns

If only one campaign exists, it's automatically selected.

## Table Name Configuration

**Important**: The service uses lowercase table names (`campaigns`, `donations`) as shown in your schema. If your Supabase database uses different casing (e.g., `Campaigns`, `Donations`), update the table names in `DonationService.js`.

To check your table names:
1. Go to your Supabase dashboard
2. Navigate to Table Editor
3. Verify the exact table names (case-sensitive)

## Environment Variables

Ensure these are set in your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

## User Authentication (Future Enhancement)

Currently, `donor_user_id` is set to `null` for all donations (guest donations). To support authenticated users:

1. Implement user authentication
2. Get the current user's ID from auth context
3. Update `DonationPage.jsx` to pass `donor_user_id` when user is logged in

Example:
```javascript
const currentUser = useAuth(); // Your auth hook
donationData.donor_user_id = currentUser?.id || null;
```

## Payment Gateway IDs

The `payment_gateway_id` field stores transaction IDs:

- **Stripe**: Payment Intent ID (e.g., `pi_1234567890`)
- **PayPal**: Order ID (e.g., `5O190127TN364715T`)

These IDs are used to:
- Track payments in your system
- Handle refunds
- Reconcile with payment provider records

## Testing

1. Create a test campaign in your database
2. Navigate to `/donate?campaign=<campaign_id>`
3. Complete a test donation
4. Verify the donation appears in the `donations` table
5. Verify the campaign's `total_raised` is updated

## Error Handling

The service includes error handling for:
- Missing Supabase configuration
- Database connection errors
- Invalid data
- Missing required fields

Errors are logged to the console and displayed to users via the UI.

## Next Steps

1. **Webhook Integration**: Set up webhooks to handle payment status updates from Stripe/PayPal
2. **Email Notifications**: Send confirmation emails after successful donations
3. **Receipt Generation**: Generate and send donation receipts
4. **Recurring Donations**: Implement recurring donation logic for `is_recurring` flag
5. **Salesforce Integration**: Populate `salesforce_donation_id` if using Salesforce

