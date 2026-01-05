import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { products } from "@/data/menu";
import { Product } from "@/types/menu";
import { ProductCard } from "@/components/home/ProductCard";

interface SearchViewProps {
  onSelectProduct: (product: Product) => void;
}

export const SearchView = ({ onSelectProduct }: SearchViewProps) => {
  const [query, setQuery] = useState("");

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.ingredients.some((i) => i.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="px-5 py-6 pb-24">
      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for juices, ingredients..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Results */}
      {query.trim() ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for "{query}"
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
              <p className="text-muted-foreground">No results found</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">🍹</span>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">What are you craving?</h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Search for your favorite juices, smoothies, or ingredients
          </p>
        </div>
      )}
    </div>
  );
};
