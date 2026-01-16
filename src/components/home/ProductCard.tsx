import { Plus, Star } from "lucide-react";
import { Product } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { getCategoryImage } from "@/utils/categoryImages";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index: number;
  categoryName?: string;
}

// Categories that have M/L sizes
const MULTI_SIZE_CATEGORIES = ["smoothie", "fresh-juice", "milkshake"];

export const ProductCard = ({ product, onSelect, index, categoryName }: ProductCardProps) => {
  const { t, language } = useLanguage();
  const productImage = getCategoryImage(product.categoryId, categoryName);
  
  // Check if this product has multiple sizes
  const hasMultipleSizes = MULTI_SIZE_CATEGORIES.some(cat => 
    product.categoryId.toLowerCase().includes(cat.toLowerCase())
  ) || (product.sizes.length > 1 && product.sizes.some(s => s.ml > 0));

  // Get prices - use product-specific large price if available, otherwise fallback to base + 10
  const basePrice = product.basePrice;
  const largePrice = product.largePrice ?? (basePrice + 10);

  // Display name based on language
  const displayName = language === "ar" ? product.description || product.name : product.name;
  const displayDescription = language === "ar" ? product.name : product.description;

  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className="bg-card rounded-3xl shadow-card overflow-hidden border border-border animate-scale-in hover:-translate-y-1 transition-transform duration-200"
    >
      {/* Product Image */}
      <div 
        className="relative h-36 overflow-hidden cursor-pointer group"
        onClick={() => onSelect(product)}
      >
        <img 
          src={productImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          {product.isPopular && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3" /> {language === "ar" ? "شائع" : "Popular"}
            </span>
          )}
          {product.isSeasonal && (
            <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
              🌸 {language === "ar" ? "موسمي" : "Seasonal"}
            </span>
          )}
        </div>
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