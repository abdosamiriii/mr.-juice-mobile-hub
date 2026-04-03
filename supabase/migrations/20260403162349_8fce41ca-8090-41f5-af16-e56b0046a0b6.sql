
DROP POLICY "System can insert notifications" ON public.notifications;

CREATE POLICY "Users receive notifications for themselves"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
