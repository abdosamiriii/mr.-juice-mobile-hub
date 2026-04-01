import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCategories } from "@/hooks/useProducts";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";
import { toast } from "sonner";

interface StaffProduct {
  id: string;
  name: string;
  base_price: number;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
}

const getStaffPin = () => sessionStorage.getItem("staff_pin") || "";

export function StaffAvailability() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["staff-products"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("staff_get_products", { p_pin: getStaffPin() });
      if (error) throw error;
      return (data as unknown as StaffProduct[]) || [];
    },
  });

  const toggleProduct = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.rpc("staff_toggle_product", {
        p_pin: getStaffPin(),
        p_product_id: id,
        p_is_active: is_active,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const isLoading = productsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
      </div>
    );
  }

  const grouped = (categories || []).map(cat => ({
    ...cat,
    products: (products || []).filter(p => p.category_id === cat.id),
  })).filter(g => g.products.length > 0);

  const uncategorized = (products || []).filter(p => !p.category_id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        <span className="font-bold text-foreground text-lg">Menu Availability</span>
      </div>

      {grouped.map(group => (
        <div key={group.id}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            <span>{group.icon}</span>
            {group.name}
          </h3>
          <div className="space-y-1">
            {group.products.map(product => (
              <div
                key={product.id}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  product.is_active ? "bg-card" : "bg-muted/50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-foreground text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.base_price} EGP</p>
                  </div>
                </div>
                <Switch
                  checked={product.is_active}
                  onCheckedChange={(checked) => toggleProduct.mutate({ id: product.id, is_active: checked })}
                  disabled={toggleProduct.isPending}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {uncategorized.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Other</h3>
          <div className="space-y-1">
            {uncategorized.map(product => (
              <div
                key={product.id}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  product.is_active ? "bg-card" : "bg-muted/50 opacity-60"
                }`}
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.base_price} EGP</p>
                </div>
                <Switch
                  checked={product.is_active}
                  onCheckedChange={(checked) => toggleProduct.mutate({ id: product.id, is_active: checked })}
                  disabled={toggleProduct.isPending}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
