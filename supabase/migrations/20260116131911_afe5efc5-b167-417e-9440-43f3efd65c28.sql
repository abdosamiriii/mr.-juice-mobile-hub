-- Add large_price column to products table for per-product size pricing
ALTER TABLE public.products ADD COLUMN large_price numeric NULL;

-- Add a comment explaining the column
COMMENT ON COLUMN public.products.large_price IS 'Price for Large size. If NULL, uses base_price + global size modifier';