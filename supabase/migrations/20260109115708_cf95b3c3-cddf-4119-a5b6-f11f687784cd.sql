-- Create delivery zones table
CREATE TABLE public.delivery_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  fee NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

-- Anyone can view active zones
CREATE POLICY "Anyone can view active delivery zones"
ON public.delivery_zones
FOR SELECT
USING (is_active = true);

-- Admins can manage zones
CREATE POLICY "Admins can manage delivery zones"
ON public.delivery_zones
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add delivery fields to orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'pickup',
ADD COLUMN IF NOT EXISTS delivery_address TEXT,
ADD COLUMN IF NOT EXISTS delivery_zone_id UUID REFERENCES public.delivery_zones(id),
ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC DEFAULT 0;

-- Insert default delivery zones
INSERT INTO public.delivery_zones (name, description, fee, sort_order) VALUES
('Pickup', 'Order pickup from store', 0, 0),
('Zone 1 - Near', 'Within 2 km radius', 15, 1),
('Zone 2 - Medium', '2-5 km radius', 25, 2),
('Zone 3 - Far', '5-10 km radius', 40, 3);

-- Add more categories for the menu
INSERT INTO public.categories (name, icon, description, sort_order) VALUES
('Family Juices', '👨‍👩‍👧‍👦', 'Large family-sized fresh juices - 1200ml', 10),
('Bella', '🥣', 'Traditional Egyptian dessert with nuts', 11),
('Om Ali', '🍮', 'Classic Egyptian warm dessert', 12),
('Fruit Salad', '🥗', 'Fresh seasonal fruit salad', 13),
('Sundae', '🍨', 'Ice cream sundae with toppings', 14)
ON CONFLICT DO NOTHING;