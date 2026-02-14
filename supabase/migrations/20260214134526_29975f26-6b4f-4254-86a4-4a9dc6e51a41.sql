
-- Add input validation constraints on orders table
CREATE OR REPLACE FUNCTION public.validate_order_inputs()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Validate customer name length
  IF NEW.customer_name IS NOT NULL AND char_length(NEW.customer_name) > 100 THEN
    RAISE EXCEPTION 'Customer name must be 100 characters or less';
  END IF;

  -- Validate phone format (Egyptian phone: 01XXXXXXXXX)
  IF NEW.customer_phone IS NOT NULL AND NEW.customer_phone !~ '^\d{10,15}$' THEN
    RAISE EXCEPTION 'Invalid phone number format';
  END IF;

  -- Validate notes length
  IF NEW.notes IS NOT NULL AND char_length(NEW.notes) > 500 THEN
    RAISE EXCEPTION 'Notes must be 500 characters or less';
  END IF;

  -- Validate delivery address length
  IF NEW.delivery_address IS NOT NULL AND char_length(NEW.delivery_address) > 500 THEN
    RAISE EXCEPTION 'Delivery address must be 500 characters or less';
  END IF;

  -- Validate total amount is positive
  IF NEW.total_amount < 0 THEN
    RAISE EXCEPTION 'Total amount cannot be negative';
  END IF;

  -- Validate order_type
  IF NEW.order_type IS NOT NULL AND NEW.order_type NOT IN ('pickup', 'delivery') THEN
    RAISE EXCEPTION 'Invalid order type';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_order_before_insert
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_order_inputs();

CREATE TRIGGER validate_order_before_update
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_order_inputs();

-- Validate order items
CREATE OR REPLACE FUNCTION public.validate_order_item_inputs()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Validate quantity
  IF NEW.quantity < 1 OR NEW.quantity > 100 THEN
    RAISE EXCEPTION 'Quantity must be between 1 and 100';
  END IF;

  -- Validate unit price is non-negative
  IF NEW.unit_price < 0 THEN
    RAISE EXCEPTION 'Unit price cannot be negative';
  END IF;

  -- Validate product name length
  IF char_length(NEW.product_name) > 200 THEN
    RAISE EXCEPTION 'Product name must be 200 characters or less';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_order_item_before_insert
  BEFORE INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_order_item_inputs();

-- Strengthen order_items INSERT policy: only allow adding to pending orders
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;
CREATE POLICY "Users can create order items"
  ON public.order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
      AND orders.status = 'pending'
    )
  );

-- Also allow guest order items (where order user_id is null)
CREATE POLICY "Guests can create order items"
  ON public.order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id IS NULL
      AND orders.status = 'pending'
    )
  );
