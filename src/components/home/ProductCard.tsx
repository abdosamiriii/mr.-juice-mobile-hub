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

// Categories that have M/L sizes (no Standard)
const ML_ONLY_CATEGORIES = ["Smoothie", "Fresh Juice", "Milkshake"];

export const ProductCard = ({ product, onSelect, index, categoryName }: ProductCardProps) => {
  const { t, language } = useLanguage();
  const productImage = getCategoryImage(product.categoryId, categoryName);
  
  // Check if this product has multiple sizes based on category name
  const hasMultipleSizes = ML_ONLY_CATEGORIES.includes(categoryName || "");

  // Get prices - use product-specific large price if available, otherwise fallback to base + 10
  const basePrice = product.basePrice;
  const largePrice = product.largePrice ?? (basePrice + 10);

  // Display name based on language
  const displayName = language === "ar" ? product.description || product.name : product.name;
  const displayDescription = language === "ar" ? product.name : product.description;

  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className="glass-card rounded-3xl overflow-hidden animate-scale-in floating glossy-highlight"
    >
      {/* Product Image */}
      <div 
        className="relative h-36 overflow-hidden cursor-pointer group"
        onClick={() => onSelect(product)}
      >
        <img 
          src={productImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient overlay with glass effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
        
        {/* Badges with glass effect */}
        <div className="absolute top-2 right-2 flex gap-1">
          {product.isPopular && (
            <span className="glass-button bg-primary/90 text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3" /> {language === "ar" ? "شائع" : "Popular"}
            </span>
          )}
          {product.isSeasonal && (
            <span className="glass-button bg-secondary/90 text-secondary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
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
                <span className="glass-button text-[10px] px-1.5 py-0.5 rounded-md text-muted-foreground">M</span>
                <span className="text-sm font-semibold text-foreground">{basePrice}</span>
                <span className="glass-button text-[10px] px-1.5 py-0.5 rounded-md text-muted-foreground">L</span>
                <span className="text-sm font-semibold text-primary">{largePrice}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-primary">{basePrice}</span>
            )}
            <span className="text-muted-foreground text-[10px]">{t("egp")}</span>
          </div>

          <Button
            variant="default"
            size="icon"
            className="rounded-xl w-10 h-10 shadow-button glossy-highlight"
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
