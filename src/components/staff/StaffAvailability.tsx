import { useProducts, useCategories, useUpdateProduct } from "@/hooks/useProducts";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";

export function StaffAvailability() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const updateProduct = useUpdateProduct();

  const isLoading = productsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
      </div>
    );
  }

  // Group products by category
  const grouped = (categories || []).map(cat => ({
    ...cat,
    products: (products || []).filter(p => p.category_id === cat.id),
  })).filter(g => g.products.length > 0);

  // Uncategorized products
  const uncategorized = (products || []).filter(p => !p.category_id);

  const handleToggle = (productId: string, currentActive: boolean) => {
    updateProduct.mutate({ id: productId, is_active: !currentActive });
  };

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
                  onCheckedChange={() => handleToggle(product.id, product.is_active)}
                  disabled={updateProduct.isPending}
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
                  onCheckedChange={() => handleToggle(product.id, product.is_active)}
                  disabled={updateProduct.isPending}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
