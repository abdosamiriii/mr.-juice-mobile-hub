import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DeliveryZone {
  id: string;
  name: string;
  description: string | null;
  fee: number;
  is_active: boolean;
  sort_order: number;
}

export const useDeliveryZones = () => {
  return useQuery({
    queryKey: ["delivery_zones"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_zones")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) throw error;
      return data as DeliveryZone[];
    },
  });
};
