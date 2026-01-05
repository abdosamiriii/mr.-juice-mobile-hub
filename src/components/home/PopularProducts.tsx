import { products } from "@/data/menu";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/menu";

interface PopularProductsProps {
  categoryFilter: string | null;
  onSelectProduct: (product: Product) => void;
}

export const PopularProducts = ({ categoryFilter, onSelectProduct }: PopularProductsProps) => {
  const filteredProducts = categoryFilter
    ? products.filter((p) => p.categoryId === categoryFilter)
    : products;

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
