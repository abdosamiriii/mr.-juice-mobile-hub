
-- Drop the existing overly permissive SELECT policy on reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;

-- Create a new SELECT policy restricted to authenticated users only
CREATE POLICY "Authenticated users can view reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Also allow admins full access
-- (admin policy already exists via other means, but ensure SELECT works)
