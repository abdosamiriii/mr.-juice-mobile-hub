-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;

-- Create new policy that allows both authenticated users and guest orders
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
WITH CHECK (
  -- Either the user is authenticated and setting their own user_id
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Or it's a guest order (user_id is NULL)
  (user_id IS NULL)
);

-- Also update the SELECT policy to allow guests to view their orders by order ID
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (
  -- Authenticated users can see their own orders
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Allow admin to see all
  has_role(auth.uid(), 'admin'::app_role)
);

-- Update DELETE policy similarly
DROP POLICY IF EXISTS "Users can delete their own orders" ON public.orders;

CREATE POLICY "Users can delete their own orders"
ON public.orders
FOR DELETE
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  has_role(auth.uid(), 'admin'::app_role)
);