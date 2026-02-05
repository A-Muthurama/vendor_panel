# Free Trial Implementation - Feature Update

## Overview
This update implements a **90-day free trial system** for vendors, replacing the immediate subscription requirement. The subscription/payment features are temporarily hidden as requested by the client.

## Key Features

### 1. **90-Day Free Trial**
- Upon admin approval, vendors automatically receive a 90-day free trial
- Free trial includes unlimited posts (999,999 posts)
- Trial period starts from the approval date

### 2. **Subscription Visibility Control**
- Subscription plans are **hidden for the first 30 days** after approval
- After 30 days of usage, subscription options become visible
- Vendors can continue using the platform for free until day 90

### 3. **Trial Expiry Handling**
- After 90 days, vendors must subscribe to continue posting offers
- Dashboard shows clear trial status and days remaining
- Urgent "SUBSCRIBE NOW" button appears when trial expires

## Changes Made

### Backend Changes

#### 1. Database Schema (`schema.sql`)
- Added `approved_at TIMESTAMP` column to `vendors` table
- Tracks when vendor was approved by admin

#### 2. Internal Controller (`controllers/internal.controller.js`)
- **`approveVendorInternal`** function updated:
  - Sets `approved_at` timestamp when approving vendor
  - Automatically creates 90-day free trial subscription
  - Trial subscription: "Free Trial" plan with 999,999 posts

#### 3. Vendor Controller (`controllers/vendor.controller.js`)
- **`getDashboardStats`** function updated:
  - Calculates trial information (days since approval, days remaining)
  - Determines when to show subscription plans (after 30 days)
  - Returns `trialInfo` object with trial status

### Frontend Changes

#### 1. Navigation Components
- **Sidebar.js**: Subscription menu item commented out (hidden)
- **TopHeader.js**: Subscription navigation item commented out (hidden)

#### 2. Dashboard (`pages/Dashboard.js`)
- Updated subscription metric card to show:
  - "Free Trial" status
  - Days remaining in trial
  - "VIEW PLANS" button (shown after 30 days)
  - "SUBSCRIBE NOW" button (shown when trial expires)
- Conditionally show "Plans" quick action card based on trial status

#### 3. Pending Approval Page (`pages/PendingApproval.js`)
- Updated messaging to inform about 90-day free trial
- Removed "View Subscription Plans" button
- Changed to "Go to Dashboard" and "Contact Support" buttons

### Migration Scripts

#### 1. `migrations/add_approved_at.js`
- Adds `approved_at` column to existing vendors table
- Sets `approved_at = created_at` for existing approved vendors

#### 2. `migrations/create_free_trials.js`
- Creates free trial subscriptions for existing approved vendors
- Only creates trials for vendors without active subscriptions

## Deployment Instructions

### 1. Run Database Migrations

```bash
# Navigate to backend directory
cd backend

# Run migration to add approved_at column
node src/migrations/add_approved_at.js

# Run migration to create free trials for existing vendors
node src/migrations/create_free_trials.js
```

### 2. Deploy Backend
- Deploy updated backend code to your server (Render/EC2)
- Ensure environment variables are set correctly

### 3. Deploy Frontend
- Build and deploy frontend to Vercel
- Clear browser cache to see changes

## Trial Timeline

| Days | Vendor Experience |
|------|-------------------|
| 0-29 | Free trial active, no subscription options shown |
| 30-89 | Free trial active, subscription plans become visible |
| 90+ | Trial expired, must subscribe to continue |

## API Response Changes

### Dashboard Stats Response
```json
{
  "vendor": { ... },
  "subscription": {
    "planName": "Free Trial",
    "remainingPosts": 999999,
    "totalPosts": 999999,
    "expiryDate": "2026-05-06T..."
  },
  "trialInfo": {
    "isInTrial": true,
    "daysSinceApproval": 15,
    "daysRemaining": 75,
    "trialExpired": false,
    "showSubscription": false
  },
  "stats": { ... }
}
```

## Future Considerations

### When Payment Gateway is Ready
1. Uncomment subscription menu items in:
   - `frontend/src/components/Sidebar.js` (line 14)
   - `frontend/src/components/TopHeader.js` (line 18)

2. The system will automatically:
   - Show subscription plans after 30 days
   - Require subscription after 90 days
   - Continue to support both free trial and paid subscriptions

### Customization Options
- **Change trial duration**: Modify the `90` days in `internal.controller.js` (line 19)
- **Change visibility threshold**: Modify the `30` days in `vendor.controller.js` (line 35)
- **Adjust trial posts**: Modify `999999` to desired limit in `internal.controller.js` (line 23)

## Testing Checklist

- [ ] New vendor registration and approval creates free trial
- [ ] Dashboard shows trial information correctly
- [ ] Subscription menu items are hidden
- [ ] Subscription plans appear after 30 days
- [ ] Trial expiry shows "SUBSCRIBE NOW" button
- [ ] Existing approved vendors receive free trials
- [ ] Vendors can create offers during trial period

## Support

For any issues or questions, contact the development team.

---
**Last Updated**: February 5, 2026
**Version**: 2.0.0 - Free Trial Implementation
