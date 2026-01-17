-- Add 'out_for_delivery' status to the order_status enum
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'out_for_delivery';