# Employee Orders Dashboard

## Overview
A standalone `/staff` page protected by a shared access code. Employees enter the code to access a simplified dashboard for managing incoming orders and toggling product availability.

## Implementation

### 1. Store access code in database
- Create a `settings` table with key-value pairs
- Store the staff access code there (default: `1234`, admin can change later)
- RLS: anyone can read settings, only admins can modify

### 2. Create Staff Dashboard page (`src/pages/Staff.tsx`)
- **PIN entry screen**: Simple 4-digit code input, validates against the DB
- **After authentication**: Two tabs only:
  - **Orders**: Real-time incoming orders with full status flow (pending → confirmed → preparing → ready → out_for_delivery → completed)
  - **Menu Availability**: List of all products with on/off toggle switches

### 3. Staff Orders View (`src/components/staff/StaffOrders.tsx`)
- Real-time order list using Supabase realtime subscriptions
- Each order card shows: order number, time, items list with quantities/sizes/add-ons, customer name, order type (pickup/delivery), delivery address, total amount
- Status update buttons to progress through the flow
- Sound notification for new orders

### 4. Staff Availability View (`src/components/staff/StaffAvailability.tsx`)
- Grid/list of all products grouped by category
- Simple toggle switch per product (is_active on/off)
- Changes reflect immediately on the customer menu

### 5. Add route in App.tsx
- Add `/staff` route (no lazy loading needed, it's lightweight)

### File changes
| File | Action |
|------|--------|
| `src/pages/Staff.tsx` | Create - PIN screen + dashboard shell |
| `src/components/staff/StaffOrders.tsx` | Create - Order management |
| `src/components/staff/StaffAvailability.tsx` | Create - Product toggles |
| `src/App.tsx` | Update - add /staff route |
| Migration | Create settings table with staff_pin |

No changes to existing admin dashboard or customer-facing code.
