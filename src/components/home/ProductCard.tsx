import { Plus, Star } from "lucide-react";
import { Product } from "@/types/menu";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index: number;
}

// Product placeholder colors based on category
const getCategoryColor = (categoryId: string): string => {
  const colors: Record<string, string> = {
    "fresh-juice": "from-orange-400 to-yellow-400",
    smoothies: "from-pink-400 to-purple-400",
    detox: "from-green-400 to-emerald-400",
    protein: "from-amber-400 to-orange-400",
    classics: "from-yellow-400 to-amber-400",
    seasonal: "from-rose-400 to-pink-400",
  };
  return colors[categoryId] || "from-purple-400 to-indigo-400";
};

export const ProductCard = ({ product, onSelect, index }: ProductCardProps) => {
  const colorGradient = getCategoryColor(product.categoryId);

  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className="bg-card rounded-3xl shadow-card overflow-hidden border border-border animate-scale-in hover:-translate-y-1 transition-transform duration-200"
    >
      {/* Image placeholder with gradient */}
      <div 
        className={`relative h-36 bg-gradient-to-br ${colorGradient} flex items-center justify-center overflow-hidden cursor-pointer`}
        onClick={() => onSelect(product)}
      >
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 flex gap-1">
          {product.isPopular && (
            <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" /> Popular
            </span>
          )}
          {product.isSeasonal && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
              🌸 Seasonal
            </span>
          )}
        </div>

        {/* Product icon/illustration */}
        <span className="text-6xl drop-shadow-lg">
          {product.categoryId === "fresh-juice" && "🍊"}
          {product.categoryId === "smoothies" && "🥤"}
          {product.categoryId === "detox" && "🥬"}
          {product.categoryId === "protein" && "💪"}
          {product.categoryId === "classics" && "🥭"}
          {product.categoryId === "seasonal" && "🍉"}
        </span>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-white/10 opacity-50" 
          style={{ 
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", 
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
          <div>
            <span className="text-lg font-bold text-primary">
              {product.basePrice}
            </span>
            <span className="text-muted-foreground text-sm ml-1">EGP</span>
          </div>

          <Button
            variant="golden"
            size="icon"
            className="rounded-xl w-10 h-10"
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
