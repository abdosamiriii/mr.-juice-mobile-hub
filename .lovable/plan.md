
# Customer Notifications System

## Overview
Add browser push notifications + in-app notification center for three use cases: abandoned cart reminders, order status updates, and promotional messages.

## Components

### 1. Database — Notifications table
- `notifications` table: `id`, `user_id`, `title`, `body`, `type` (cart_reminder / order_update / promotion), `is_read`, `order_id`, `created_at`
- RLS: users can read/update their own notifications

### 2. In-App Notification Center
- Bell icon with unread badge in the main app header
- Dropdown/sheet showing notification list
- Mark as read on tap, mark all as read button
- Real-time updates via Supabase realtime

### 3. Browser Push Notifications (PWA)
- Service Worker registration for push notifications
- Push subscription stored in a `push_subscriptions` table
- Permission request prompt on first login
- Uses Web Push API (no third-party service needed)

### 4. Order Status Updates
- Database trigger: when order status changes → insert notification for the customer
- Push notification sent automatically

### 5. Abandoned Cart Reminders
- Edge function triggered by pg_cron (every 30 min)
- Checks for users with items in cart context who haven't ordered in 30+ minutes
- Creates notification + sends push

### 6. Promotional Notifications (Admin)
- New "Notifications" tab in admin dashboard
- Form to compose and send a promotional message to all users
- Bulk insert into notifications table + push to all subscribers

## Files to create/modify
| File | Action |
|------|--------|
| DB migration | Create `notifications` + `push_subscriptions` tables, trigger for order updates |
| `src/components/notifications/NotificationBell.tsx` | In-app notification bell + dropdown |
| `src/components/notifications/NotificationList.tsx` | Notification items list |
| `src/hooks/useNotifications.ts` | Hook for fetching/managing notifications |
| `src/components/admin/NotificationsManager.tsx` | Admin promotional notifications UI |
| `supabase/functions/send-push/index.ts` | Edge function to send web push |
| `supabase/functions/cart-reminder/index.ts` | Scheduled abandoned cart checker |
| `public/sw.js` | Service worker for push |
| `src/pages/Admin.tsx` | Add Notifications tab |
| `src/pages/Index.tsx` | Add NotificationBell to header |
