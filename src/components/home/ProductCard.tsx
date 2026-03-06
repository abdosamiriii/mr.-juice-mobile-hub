import { Plus, Star, Heart } from "lucide-react";
import { Product } from "@/types/menu";
import { useLanguage } from "@/context/LanguageContext";
import { getCategoryImage } from "@/utils/categoryImages";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index: number;
  categoryName?: string;
  reviewAvg?: number;
  reviewCount?: number;
}

const ML_ONLY_CATEGORIES = ["Smoothie", "Fresh Juice", "Fresh Juices", "Milkshake"];

export const ProductCard = ({ product, onSelect, index, categoryName, reviewAvg = 0, reviewCount = 0 }: ProductCardProps) => {
  const { t, language } = useLanguage();
  const productImage = product.image && product.image.startsWith("http") 
    ? product.image 
    : getCategoryImage(product.categoryId, categoryName);
  
  const hasMultipleSizes = ML_ONLY_CATEGORIES.includes(categoryName || "");
  const basePrice = product.basePrice;
  const largePrice = product.largePrice ?? (basePrice + 10);

  const displayName = language === "ar" ? product.description || product.name : product.name;

  const rating = reviewCount > 0 ? Math.round(reviewAvg) : (product.isPopular ? 5 : 4);

  return (
    <div
      style={{ animationDelay: `${index * 60}ms` }}
      className="bg-card rounded-3xl overflow-hidden animate-scale-in group/card transition-all duration-300 ease-out shadow-card hover:-translate-y-2 hover:shadow-elevated active:scale-[0.98]"
      onClick={() => onSelect(product)}
    >
      {/* Image area */}
      <div className="relative h-32 bg-muted overflow-hidden flex items-center justify-center">
        <img 
          src={productImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
        />
        
        {/* Heart button */}
        <button 
          className="absolute top-2.5 start-2.5 w-8 h-8 rounded-full bg-card/90 flex items-center justify-center shadow-sm transition-transform hover:scale-110"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="w-4 h-4 text-primary" />
        </button>

        {/* Badges */}
        <div className="absolute top-2.5 end-2.5 flex gap-1">
          {product.isPopular && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-0.5 shadow-sm">
              <Star className="w-3 h-3" /> {language === "ar" ? "شائع" : "Hot"}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h4 className="font-display font-bold text-foreground text-sm mb-1 truncate leading-tight">
          {displayName}
        </h4>

        {/* Star rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i <= rating ? "text-primary fill-primary" : "text-muted"}`}
              />
            ))}
          </div>
          {reviewCount > 0 && (
            <span className="text-[10px] text-muted-foreground">({reviewCount})</span>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div>
            {hasMultipleSizes ? (
              <div className="flex items-center gap-1.5">
                <span className="bg-muted text-[9px] px-1.5 py-0.5 rounded-md text-muted-foreground font-semibold">M</span>
                <span className="text-sm font-bold text-foreground">{basePrice}</span>
                <span className="bg-muted text-[9px] px-1.5 py-0.5 rounded-md text-muted-foreground font-semibold">L</span>
                <span className="text-sm font-bold text-primary">{largePrice}</span>
              </div>
            ) : (
              <div>
                <span className="text-base font-extrabold text-primary">{basePrice}</span>
                <span className="text-muted-foreground text-[10px] ms-1">{t("egp")}</span>
              </div>
            )}
          </div>

          <button
            className="w-9 h-9 rounded-full bg-primary text-primary-foreground shadow-button flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
