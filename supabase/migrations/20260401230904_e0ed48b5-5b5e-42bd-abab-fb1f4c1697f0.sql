
-- Function: get orders for staff (validates PIN server-side)
CREATE OR REPLACE FUNCTION public.staff_get_orders(p_pin text)
RETURNS SETOF jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate PIN
  IF NOT EXISTS (
    SELECT 1 FROM public.app_settings WHERE key = 'staff_pin' AND value = p_pin
  ) THEN
    RAISE EXCEPTION 'Invalid staff PIN';
  END IF;

  RETURN QUERY
  SELECT jsonb_build_object(
    'id', o.id,
    'user_id', o.user_id,
    'customer_name', o.customer_name,
    'customer_phone', o.customer_phone,
    'status', o.status,
    'total_amount', o.total_amount,
    'notes', o.notes,
    'order_type', o.order_type,
    'delivery_address', o.delivery_address,
    'delivery_zone_id', o.delivery_zone_id,
    'delivery_fee', o.delivery_fee,
    'created_at', o.created_at,
    'updated_at', o.updated_at,
    'order_items', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'id', oi.id,
        'order_id', oi.order_id,
        'product_id', oi.product_id,
        'product_name', oi.product_name,
        'size_name', oi.size_name,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price,
        'add_ons', oi.add_ons,
        'created_at', oi.created_at
      )) FROM public.order_items oi WHERE oi.order_id = o.id),
      '[]'::jsonb
    )
  )
  FROM public.orders o
  ORDER BY o.created_at DESC;
END;
$$;

-- Function: update order status for staff (validates PIN server-side)
CREATE OR REPLACE FUNCTION public.staff_update_order_status(p_pin text, p_order_id uuid, p_status order_status)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.app_settings WHERE key = 'staff_pin' AND value = p_pin
  ) THEN
    RAISE EXCEPTION 'Invalid staff PIN';
  END IF;

  UPDATE public.orders SET status = p_status, updated_at = now() WHERE id = p_order_id;
END;
$$;

-- Function: toggle product availability for staff (validates PIN server-side)
CREATE OR REPLACE FUNCTION public.staff_toggle_product(p_pin text, p_product_id uuid, p_is_active boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.app_settings WHERE key = 'staff_pin' AND value = p_pin
  ) THEN
    RAISE EXCEPTION 'Invalid staff PIN';
  END IF;

  UPDATE public.products SET is_active = p_is_active, updated_at = now() WHERE id = p_product_id;
END;
$$;

-- Function: get all products with categories for staff (validates PIN)
CREATE OR REPLACE FUNCTION public.staff_get_products(p_pin text)
RETURNS SETOF jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.app_settings WHERE key = 'staff_pin' AND value = p_pin
  ) THEN
    RAISE EXCEPTION 'Invalid staff PIN';
  END IF;

  RETURN QUERY
  SELECT jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'base_price', p.base_price,
    'image_url', p.image_url,
    'category_id', p.category_id,
    'is_active', p.is_active
  )
  FROM public.products p
  ORDER BY p.name;
END;
$$;
