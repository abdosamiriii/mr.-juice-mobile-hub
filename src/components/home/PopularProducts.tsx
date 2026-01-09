import { useProducts, useSizes, useAddOns } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/menu";
import { useMemo } from "react";

interface PopularProductsProps {
  categoryFilter: string | null;
  onSelectProduct: (product: Product) => void;
}

export const PopularProducts = ({ categoryFilter, onSelectProduct }: PopularProductsProps) => {
  const { data: dbProducts = [], isLoading: productsLoading } = useProducts();
  const { data: dbSizes = [], isLoading: sizesLoading } = useSizes();
  const { data: dbAddOns = [], isLoading: addOnsLoading } = useAddOns();

  const isLoading = productsLoading || sizesLoading || addOnsLoading;

  // Convert DB products to menu Product format
  const products: Product[] = useMemo(() => {
    return dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      basePrice: p.base_price,
      image: p.image_url || "https://images.unsplash.com/photo-1546173159-315724a31696?w=400",
      categoryId: p.category_id || "",
      sizes: dbSizes.map((s) => ({
        id: s.id,
        name: s.name,
        priceModifier: s.price_modifier,
        ml: s.ml,
      })),
      addOns: dbAddOns.map((a) => ({
        id: a.id,
        name: a.name,
        price: a.price,
        icon: a.icon,
      })),
      ingredients: p.ingredients || [],
      calories: p.calories || 0,
      isPopular: p.is_popular,
      isSeasonal: p.is_seasonal,
    }));
  }, [dbProducts, dbSizes, dbAddOns]);

  const filteredProducts = categoryFilter
    ? products.filter((p) => p.categoryId === categoryFilter)
    : products.filter((p) => p.isPopular);

  if (isLoading) {
    return (
      <section className="px-5 pb-32">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-foreground">
            {categoryFilter ? "Menu" : "Popular Now"} 🔥
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted animate-pulse rounded-2xl h-48" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 pb-32">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-foreground">
          {categoryFilter ? "Menu" : "Popular Now"} 🔥
        </h3>
        <button className="text-primary text-sm font-medium">See All</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
            index={index}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <span className="text-5xl mb-4 block">🍹</span>
          <p className="text-muted-foreground">No products in this category yet</p>
        </div>
      )}
    </section>
  );
};
