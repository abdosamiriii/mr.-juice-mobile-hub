import { useState } from "react";
import { X, Minus, Plus, Check, Leaf } from "lucide-react";
import { Product, Size, AddOn } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { sizes as defaultSizes } from "@/data/menu";

interface ProductDetailSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
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

const getEmoji = (categoryId: string): string => {
  const emojis: Record<string, string> = {
    "fresh-juice": "🍊",
    smoothies: "🥤",
    detox: "🥬",
    protein: "💪",
    classics: "🥭",
    seasonal: "🍉",
  };
  return emojis[categoryId] || "🍹";
};

export const ProductDetailSheet = ({ product, isOpen, onClose }: ProductDetailSheetProps) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<Size>(defaultSizes[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const colorGradient = getCategoryColor(product.categoryId);
  const emoji = getEmoji(product.categoryId);

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.id === addOn.id)
        ? prev.filter((a) => a.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  const toggleIngredient = (ingredient: string) => {
    setExcludedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const totalPrice =
    (product.basePrice +
      selectedSize.priceModifier +
      selectedAddOns.reduce((sum, a) => sum + a.price, 0)) *
    quantity;

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedAddOns, excludedIngredients, quantity);
    onClose();
    // Reset state
    setSelectedSize(defaultSizes[0]);
    setSelectedAddOns([]);
    setExcludedIngredients([]);
    setQuantity(1);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl max-h-[90vh] overflow-hidden transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header Image */}
        <div className={`relative h-48 bg-gradient-to-br ${colorGradient} flex items-center justify-center`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-8xl drop-shadow-lg">{emoji}</span>
          <div className="absolute inset-0 bg-white/10 opacity-50" 
            style={{ 
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", 
              backgroundSize: "20px 20px" 
            }} 
          />
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-12rem)] hide-scrollbar">
          {/* Title & Price */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">{product.name}</h2>
              <p className="text-muted-foreground text-sm mt-1">{product.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{product.basePrice}</p>
              <p className="text-muted-foreground text-xs">EGP</p>
            </div>
          </div>

          {/* Calories */}
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground">{product.calories} calories</span>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Size</h3>
            <div className="flex gap-3">
              {defaultSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`flex-1 py-3 rounded-2xl border-2 transition-all duration-200 ${
                    selectedSize.id === size.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <p className="font-semibold text-foreground">{size.name}</p>
                  <p className="text-xs text-muted-foreground">{size.ml}ml</p>
                  {size.priceModifier > 0 && (
                    <p className="text-xs text-primary mt-1">+{size.priceModifier} EGP</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Add-ons</h3>
            <div className="grid grid-cols-2 gap-3">
              {product.addOns.map((addOn) => {
                const isSelected = selectedAddOns.find((a) => a.id === addOn.id);
                return (
                  <button
                    key={addOn.id}
                    onClick={() => toggleAddOn(addOn)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <span className="text-xl">{addOn.icon}</span>
                    <div className="text-left flex-1">
                      <p className="font-medium text-foreground text-sm">{addOn.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {addOn.price > 0 ? `+${addOn.price} EGP` : "Free"}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Ingredients (tap to exclude)</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ingredient) => {
                const isExcluded = excludedIngredients.includes(ingredient);
                return (
                  <button
                    key={ingredient}
                    onClick={() => toggleIngredient(ingredient)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isExcluded
                        ? "bg-destructive/10 text-destructive line-through"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {ingredient}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-card safe-bottom">
          <div className="flex items-center gap-4 mb-4">
            {/* Quantity */}
            <div className="flex items-center gap-3 bg-muted rounded-2xl p-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm"
              >
                <Minus className="w-4 h-4 text-foreground" />
              </button>
              <span className="w-8 text-center font-bold text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm"
              >
                <Plus className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              variant="hero"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
            >
              Add to Cart • {totalPrice.toFixed(0)} EGP
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
