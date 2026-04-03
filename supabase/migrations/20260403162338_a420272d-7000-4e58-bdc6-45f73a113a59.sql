
-- Notification type enum
CREATE TYPE public.notification_type AS ENUM ('cart_reminder', 'order_update', 'promotion');

-- Notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'promotion',
  is_read BOOLEAN NOT NULL DEFAULT false,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications"
ON public.notifications FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- Push subscriptions table
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own subscriptions"
ON public.push_subscriptions FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
ON public.push_subscriptions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger: create notification on order status change
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_title TEXT;
  v_body TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.user_id IS NOT NULL THEN
    CASE NEW.status
      WHEN 'confirmed' THEN
        v_title := '✅ Order Confirmed';
        v_body := 'Your order #' || LEFT(NEW.id::text, 8) || ' has been confirmed!';
      WHEN 'preparing' THEN
        v_title := '👨‍🍳 Preparing Your Order';
        v_body := 'Your order #' || LEFT(NEW.id::text, 8) || ' is being prepared.';
      WHEN 'ready' THEN
        v_title := '🎉 Order Ready!';
        v_body := 'Your order #' || LEFT(NEW.id::text, 8) || ' is ready for pickup!';
      WHEN 'out_for_delivery' THEN
        v_title := '🚗 On The Way!';
        v_body := 'Your order #' || LEFT(NEW.id::text, 8) || ' is out for delivery.';
      WHEN 'completed' THEN
        v_title := '✨ Order Complete';
        v_body := 'Your order #' || LEFT(NEW.id::text, 8) || ' has been completed. Enjoy!';
      WHEN 'cancelled' THEN
        v_title := '❌ Order Cancelled';
        v_body := 'Your order #' || LEFT(NEW.id::text, 8) || ' has been cancelled.';
      ELSE
        RETURN NEW;
    END CASE;

    INSERT INTO public.notifications (user_id, title, body, type, order_id)
    VALUES (NEW.user_id, v_title, v_body, 'order_update', NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_status_change
AFTER UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.notify_order_status_change();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
