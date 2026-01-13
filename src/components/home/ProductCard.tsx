import { Plus, Star } from "lucide-react";
import { Product } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

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

// Categories that have M/L sizes
const MULTI_SIZE_CATEGORIES = ["smoothie", "fresh-juice", "milkshake"];

export const ProductCard = ({ product, onSelect, index }: ProductCardProps) => {
  const { t, language } = useLanguage();
  const emoji = getCategoryEmoji(product.categoryId);
  
  // Check if this product has multiple sizes
  const hasMultipleSizes = MULTI_SIZE_CATEGORIES.some(cat => 
    product.categoryId.toLowerCase().includes(cat.toLowerCase())
  ) || (product.sizes.length > 1 && product.sizes.some(s => s.ml > 0));

  // Get prices
  const basePrice = product.basePrice;
  const largePrice = basePrice + 10; // Large adds 10 EGP

  // Display name based on language
  const displayName = language === "ar" ? product.description || product.name : product.name;
  const displayDescription = language === "ar" ? product.name : product.description;

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
              <Star className="w-3 h-3" /> {language === "ar" ? "شائع" : "Popular"}
            </span>
          )}
          {product.isSeasonal && (
            <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
              🌸 {language === "ar" ? "موسمي" : "Seasonal"}
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
          {displayName}
        </h4>
        <p className="text-muted-foreground text-xs line-clamp-2 mb-3 h-8">
          {displayDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {hasMultipleSizes ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">M:</span>
                <span className="text-sm font-semibold text-foreground">{basePrice}</span>
                <span className="text-xs text-muted-foreground">L:</span>
                <span className="text-sm font-semibold text-primary">{largePrice}</span>
              </div>
            ) : (
              <span className="text-lg font-semibold text-primary">{basePrice}</span>
            )}
            <span className="text-muted-foreground text-[10px]">{t("egp")}</span>
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