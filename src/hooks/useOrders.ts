import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface DbOrder {
  id: string;
  user_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  status: OrderStatus;
  total_amount: number;
  notes: string | null;
  order_type: string | null;
  delivery_address: string | null;
  delivery_zone_id: string | null;
  delivery_fee: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  size_name: string | null;
  quantity: number;
  unit_price: number;
  add_ons: { name: string; price: number }[] | null;
  created_at: string;
}

export interface OrderWithItems extends DbOrder {
  order_items: DbOrderItem[];
}

export const useOrders = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as OrderWithItems[];
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated");
    },
    onError: (error) => {
      toast.error(`Failed to update order: ${error.message}`);
    },
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ["order-stats"],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("status, total_amount, created_at");

      if (error) throw error;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const todayOrders = orders?.filter(o => new Date(o.created_at) >= today) || [];
      const weekOrders = orders?.filter(o => new Date(o.created_at) >= weekAgo) || [];

      const completedOrders = orders?.filter(o => o.status === 'completed') || [];
      const pendingOrders = orders?.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)) || [];

      return {
        totalOrders: orders?.length || 0,
        todayOrders: todayOrders.length,
        weekOrders: weekOrders.length,
        totalRevenue: completedOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
        todayRevenue: todayOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + Number(o.total_amount), 0),
        weekRevenue: weekOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + Number(o.total_amount), 0),
        pendingCount: pendingOrders.length,
        completedCount: completedOrders.length,
      };
    },
  });
};
