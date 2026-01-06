import { Plus, Star } from "lucide-react";
import { Product } from "@/types/menu";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index: number;
}

// Category emoji mapping
const getCategoryEmoji = (categoryId: string): string => {
  const emojis: Record<string, string> = {
    "fresh-juice": "🍊",
    milkshake: "🥛",
    smoothie: "🥤",
    gelato: "🍨",
    waffle: "🧇",
    mojito: "🍹",
    "greek-yogurt": "🥣",
    hot: "☕",
    pancakes: "🥞",
  };
  return emojis[categoryId] || "🍹";
};

export const ProductCard = ({ product, onSelect, index }: ProductCardProps) => {
  const emoji = getCategoryEmoji(product.categoryId);
  
  // Get large price (base price + 10 for large size modifier)
  const mediumPrice = product.basePrice;
  const largePrice = product.sizes.find(s => s.id === "large")?.priceModifier 
    ? product.basePrice + (product.sizes.find(s => s.id === "large")?.priceModifier || 0)
    : product.basePrice;

  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className="bg-card rounded-3xl shadow-card overflow-hidden border border-border animate-scale-in hover:-translate-y-1 transition-transform duration-200"
    >
      {/* Image placeholder with gradient */}
      <div 
        className="relative h-36 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => onSelect(product)}
      >
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 flex gap-1">
          {product.isPopular && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" /> Popular
            </span>
          )}
          {product.isSeasonal && (
            <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
              🌸 Seasonal
            </span>
          )}
        </div>

        {/* Product icon/illustration */}
        <span className="text-6xl drop-shadow-lg">{emoji}</span>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-50" 
          style={{ 
            backgroundImage: "radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.1) 1px, transparent 0)", 
            backgroundSize: "20px 20px" 
          }} 
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-display font-bold text-foreground text-base mb-1 truncate">
          {product.name}
        </h4>
        <p className="text-muted-foreground text-xs line-clamp-2 mb-3 h-8">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">M:</span>
              <span className="text-sm font-semibold text-foreground">{mediumPrice}</span>
              {product.sizes.length > 1 && (
                <>
                  <span className="text-xs text-muted-foreground">L:</span>
                  <span className="text-sm font-semibold text-primary">{largePrice}</span>
                </>
              )}
            </div>
            <span className="text-muted-foreground text-[10px]">EGP</span>
          </div>

          <Button
            variant="default"
            size="icon"
            className="rounded-xl w-10 h-10 shadow-button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
