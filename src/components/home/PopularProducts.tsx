import { useProducts, useSizes, useAddOns, useCategories } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/menu";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

// Categories that should NOT have size selection (single size only)
const NO_SIZE_CATEGORIES = [
  "Sundae",
  "Waffles", 
  "Pancakes",
  "Mojito",
  "Belila",
  "Om Ali",
  "Gelato"
];

// Scoop add-on names (for Gelato only)
const SCOOP_ADDON_NAMES = ["2 Scoops", "3 Scoops", "4 Scoops", "5 Scoops"];

// Categories that use scoop add-ons
const SCOOP_CATEGORIES = ["Gelato"];

interface PopularProductsProps {
  categoryFilter: string | null;
  onSelectProduct: (product: Product, categoryName?: string) => void;
}

export const PopularProducts = ({ categoryFilter, onSelectProduct }: PopularProductsProps) => {
  const { data: dbProducts = [], isLoading: productsLoading } = useProducts();
  const { data: dbSizes = [], isLoading: sizesLoading } = useSizes();
  const { data: dbAddOns = [], isLoading: addOnsLoading } = useAddOns();
  const { data: dbCategories = [], isLoading: categoriesLoading } = useCategories();
  const { t } = useLanguage();

  const isLoading = productsLoading || sizesLoading || addOnsLoading || categoriesLoading;

  // Convert DB products to menu Product format with category info
  const productsWithCategory = useMemo(() => {
    return dbProducts.map((p) => {
      // Find the category name for this product
      const category = dbCategories.find((c) => c.id === p.category_id);
      const categoryName = category?.name || "";
      
      // Check if this category should have sizes
      const hasSize = !NO_SIZE_CATEGORIES.includes(categoryName);
      
      const product: Product = {
        id: p.id,
        name: p.name,
        description: p.description || "",
        basePrice: p.base_price,
        largePrice: p.large_price ?? undefined,
        image: p.image_url || "https://images.unsplash.com/photo-1546173159-315724a31696?w=400",
        categoryId: p.category_id || "",
        sizes: hasSize ? dbSizes.map((s) => ({
          id: s.id,
          name: s.name,
          priceModifier: s.price_modifier,
          ml: s.ml,
        })) : [{ id: "default", name: "Regular", priceModifier: 0, ml: 0 }],
        addOns: dbAddOns
          .filter((a) => {
            // Scoop add-ons only for Gelato
            if (SCOOP_ADDON_NAMES.includes(a.name)) {
              return SCOOP_CATEGORIES.includes(categoryName);
            }
            // Other add-ons for non-Gelato (or show none for Gelato except scoops)
            return !SCOOP_CATEGORIES.includes(categoryName);
          })
          .map((a) => ({
            id: a.id,
            name: a.name,
            price: a.price,
            icon: a.icon,
          })),
        ingredients: p.ingredients || [],
        calories: p.calories || 0,
        isPopular: p.is_popular,
        isSeasonal: p.is_seasonal,
      };
      
      return { product, categoryName };
    });
  }, [dbProducts, dbSizes, dbAddOns, dbCategories]);

  const filteredItems = categoryFilter
    ? productsWithCategory.filter((item) => item.product.categoryId === categoryFilter)
    : productsWithCategory.filter((item) => item.product.isPopular);

  if (isLoading) {
    return (
      <section className="px-5 pb-32">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-foreground">
            {categoryFilter ? t("menu") : t("popularNow")} 🔥
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
          {categoryFilter ? t("menu") : t("popularNow")} 🔥
        </h3>
        <button className="text-primary text-sm font-medium transition-all duration-300 ease-out hover:scale-105 hover:text-primary/80 active:scale-95">{t("seeAll")}</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredItems.map(({ product, categoryName }, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={(p) => onSelectProduct(p, categoryName)}
            index={index}
            categoryName={categoryName}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <span className="text-5xl mb-4 block">🍹</span>
          <p className="text-muted-foreground">{t("noProductsInCategory")}</p>
        </div>
      )}
    </section>
  );
};