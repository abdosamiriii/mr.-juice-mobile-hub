-- Add DELETE policy for orders - users can delete their own orders
CREATE POLICY "Users can delete their own orders" 
ON public.orders 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add DELETE policy for order_items - users can delete items from their orders
CREATE POLICY "Users can delete their own order items" 
ON public.order_items 
FOR DELETE 
USING (EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = order_items.order_id) AND (orders.user_id = auth.uid()))));