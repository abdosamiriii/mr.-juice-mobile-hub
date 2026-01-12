import { Search as SearchIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { useProducts, useSizes, useAddOns, useCategories } from "@/hooks/useProducts";
import { Product } from "@/types/menu";
import { ProductCard } from "@/components/home/ProductCard";
import { useLanguage } from "@/context/LanguageContext";

interface SearchViewProps {
  onSelectProduct: (product: Product) => void;
}

export const SearchView = ({ onSelectProduct }: SearchViewProps) => {
  const [query, setQuery] = useState("");
  const { t, direction } = useLanguage();
  
  const { data: dbProducts = [] } = useProducts();
  const { data: dbSizes = [] } = useSizes();
  const { data: dbAddOns = [] } = useAddOns();
  const { data: dbCategories = [] } = useCategories();

  // Convert DB products to Product format
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

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.ingredients.some((i) => i.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="px-5 py-6 pb-24" dir={direction}>
      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("searchForJuices")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full ps-12 pe-4 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Results */}
      {query.trim() ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {filteredProducts.length} {filteredProducts.length === 1 ? t("result") : t("resultsFor")} "{query}"
          </p>
          
          {filteredProducts.length > 0 ? (
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
          ) : (
            <div className="text-center py-12">
              <span className="text-5xl mb-4 block">🔍</span>
              <p className="text-muted-foreground">{t("noResults")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("tryDifferentSearch")}</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">🍹</span>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">{t("whatAreYouCraving")}</h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            {t("searchDescription")}
          </p>
        </div>
      )}
    </div>
  );
};