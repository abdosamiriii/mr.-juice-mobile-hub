
-- ============================================================
-- 1. PERFORMANCE: Add missing indexes for 200+ orders/day load
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);

-- ============================================================
-- 2. SECURITY: Restrict order deletion to pending orders only
-- ============================================================
DROP POLICY IF EXISTS "Users can delete their own orders" ON public.orders;
CREATE POLICY "Users can delete their own pending orders"
ON public.orders
FOR DELETE
USING (
  (status = 'pending'::order_status)
  AND (
    ((auth.uid() IS NOT NULL) AND (auth.uid() = user_id))
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- ============================================================
-- 3. TRANSACTION SAFETY: Atomic order creation function
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_order_with_items(
  p_user_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_notes text,
  p_total_amount numeric,
  p_order_type text,
  p_delivery_zone_id uuid,
  p_delivery_fee numeric,
  p_delivery_address text,
  p_items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
  v_item jsonb;
BEGIN
  -- Insert order
  INSERT INTO public.orders (
    user_id, customer_name, customer_phone, notes,
    total_amount, order_type, delivery_zone_id, delivery_fee, delivery_address
  ) VALUES (
    p_user_id, p_customer_name, p_customer_phone, p_notes,
    p_total_amount, p_order_type, p_delivery_zone_id, p_delivery_fee, p_delivery_address
  ) RETURNING id INTO v_order_id;

  -- Insert all order items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.order_items (
      order_id, product_id, product_name, size_name, quantity, unit_price, add_ons
    ) VALUES (
      v_order_id,
      NULLIF(v_item->>'product_id', '')::uuid,
      v_item->>'product_name',
      v_item->>'size_name',
      (v_item->>'quantity')::int,
      (v_item->>'unit_price')::numeric,
      COALESCE(v_item->'add_ons', '[]'::jsonb)
    );
  END LOOP;

  RETURN v_order_id;
END;
$$;
