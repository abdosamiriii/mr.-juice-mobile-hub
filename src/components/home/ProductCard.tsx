import { Plus, Star, Heart } from "lucide-react";
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
  
  const hasMultipleSizes = ML_ONLY_CATEGORIES.includes(categoryName || "");
  const basePrice = product.basePrice;
  const largePrice = product.largePrice ?? (basePrice + 10);

  const displayName = language === "ar" ? product.description || product.name : product.name;
  const displayDescription = language === "ar" ? product.name : product.description;

  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className="bg-card rounded-3xl overflow-hidden animate-scale-in group/card transition-all duration-300 ease-out shadow-card hover:-translate-y-2 hover:shadow-elevated active:scale-[0.98]"
    >
      {/* Product Image */}
      <div 
        className="relative h-36 overflow-hidden cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img 
          src={productImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 ease-out group-hover/card:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Heart icon */}
        <button className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm transition-transform hover:scale-110">
          <Heart className="w-4 h-4 text-juice-pink" />
        </button>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          {product.isPopular && (
            <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3" /> {language === "ar" ? "شائع" : "Popular"}
            </span>
          )}
          {product.isSeasonal && (
            <span className="bg-juice-pink text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
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
                <span className="bg-muted text-[10px] px-1.5 py-0.5 rounded-md text-muted-foreground font-medium">M</span>
                <span className="text-sm font-semibold text-foreground">{basePrice}</span>
                <span className="bg-muted text-[10px] px-1.5 py-0.5 rounded-md text-muted-foreground font-medium">L</span>
                <span className="text-sm font-semibold text-primary">{largePrice}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-primary">{basePrice}</span>
            )}
            <span className="text-muted-foreground text-[10px]">{t("egp")}</span>
          </div>

          <Button
            size="icon"
            className="rounded-xl w-10 h-10 bg-primary text-primary-foreground shadow-button transition-all duration-300 hover:rotate-90 hover:scale-110 hover:shadow-xl active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
          >
            <Plus className="w-5 h-5 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </div>
  );
};
