import { useState } from "react";
import { X, Minus, Plus, Check, Leaf, Star } from "lucide-react";
import { Product, Size, AddOn } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { sizes as defaultSizes } from "@/data/menu";
import { getCategoryImage } from "@/utils/categoryImages";

interface ProductDetailSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
}

// Alternating detail card colors matching reference
const DETAIL_COLORS = [
  "bg-secondary", // yellow
  "bg-juice-pink/20", // pink
  "bg-primary", // purple
];

export const ProductDetailSheet = ({ product, isOpen, onClose, categoryName }: ProductDetailSheetProps) => {
  const { addItem } = useCart();
  const { t, direction, language } = useLanguage();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const standardOnlyCategories = ["Gelato", "Sundae", "Waffles", "Pancakes", "Mojito", "Belila", "Om Ali", "Greek Yogurt", "Fruit Salad", "Hot", "Family Juices"];
  const mlOnlyCategories = ["Smoothie", "Fresh Juice", "Milkshake"];
  
  const isStandardOnly = standardOnlyCategories.includes(categoryName || "");
  const isMlOnly = mlOnlyCategories.includes(categoryName || "");
  
  const productSizes = product.sizes.length > 0 ? product.sizes : defaultSizes;
  const availableSizes = productSizes.filter(size => {
    if (isStandardOnly) return size.name === "Standard";
    if (isMlOnly) return size.name === "Medium" || size.name === "Large";
    return true;
  });
  const currentSize = selectedSize || availableSizes[0];

  const productImage = getCategoryImage(product.categoryId, categoryName);

  const isScoopAddOn = (name: string) => ["2 Scoops", "3 Scoops", "4 Scoops", "5 Scoops"].includes(name);
  const hasScoopAddOns = product.addOns.some(a => isScoopAddOn(a.name));

  const toggleAddOn = (addOn: AddOn) => {
    if (isScoopAddOn(addOn.name)) {
      setSelectedAddOns((prev) => {
        const isCurrentlySelected = prev.find((a) => a.id === addOn.id);
        if (isCurrentlySelected) {
          return prev.filter((a) => !isScoopAddOn(a.name));
        } else {
          return [...prev.filter((a) => !isScoopAddOn(a.name)), addOn];
        }
      });
    } else {
      setSelectedAddOns((prev) =>
        prev.find((a) => a.id === addOn.id)
          ? prev.filter((a) => a.id !== addOn.id)
          : [...prev, addOn]
      );
    }
  };

  const getNumberOfScoops = () => {
    const scoopAddOn = selectedAddOns.find(a => isScoopAddOn(a.name));
    if (!scoopAddOn) return 1;
    if (scoopAddOn.name === "2 Scoops") return 2;
    if (scoopAddOn.name === "3 Scoops") return 3;
    if (scoopAddOn.name === "4 Scoops") return 4;
    if (scoopAddOn.name === "5 Scoops") return 5;
    return 1;
  };

  const calculateTotalPrice = () => {
    if (hasScoopAddOns) {
      const scoops = getNumberOfScoops();
      return product.basePrice * scoops * quantity;
    } else {
      const sizePrice = currentSize.name === "Large" && product.largePrice
        ? product.largePrice
        : product.basePrice + currentSize.priceModifier;
      const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
      return (sizePrice + addOnsTotal) * quantity;
    }
  };

  const totalPrice = calculateTotalPrice();

  const handleAddToCart = () => {
    addItem(product, currentSize, selectedAddOns, excludedIngredients, quantity);
    onClose();
    setSelectedSize(null);
    setSelectedAddOns([]);
    setExcludedIngredients([]);
    setQuantity(1);
  };

  const displayName = language === "ar" ? product.description || product.name : product.name;
  const displayDesc = language === "ar" ? product.name : product.description;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-[2.5rem] max-h-[92vh] overflow-hidden transition-transform duration-300 shadow-elevated ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        dir={direction}
      >
        {/* Header with colored background matching reference */}
        <div className="relative bg-secondary h-48 overflow-hidden">
          <img 
            src={productImage} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 end-4 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center shadow-sm z-10"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>

          {/* Info badges overlay - matching reference: Calories + ML */}
          <div className="absolute top-4 start-4 flex flex-col gap-2">
            <div className="bg-card/90 rounded-2xl px-3 py-2 shadow-sm">
              <p className="text-[10px] text-muted-foreground">Calories</p>
              <p className="text-sm font-bold text-foreground">{product.calories || 120}</p>
            </div>
            {currentSize.ml > 0 && (
              <div className="bg-card/90 rounded-2xl px-3 py-2 shadow-sm">
                <p className="text-[10px] text-muted-foreground">ml</p>
                <p className="text-sm font-bold text-foreground">{currentSize.ml}</p>
              </div>
            )}
          </div>

          {/* Price badge */}
          <div className="absolute bottom-4 start-4 bg-secondary rounded-2xl px-4 py-2 shadow-sm">
            <p className="text-[10px] text-secondary-foreground/60">Price</p>
            <p className="text-lg font-bold text-secondary-foreground">{product.basePrice}.00 LE</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(92vh-14rem)] hide-scrollbar">
          {/* Product name and description */}
          <h2 className="font-display text-xl font-bold text-foreground mb-1">{displayName}</h2>
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{displayDesc}</p>

          {/* Size Selection - pill style matching reference */}
          {availableSizes.length > 1 && availableSizes.some(s => s.ml > 0) && (
            <div className="mb-5">
              <h3 className="font-semibold text-foreground mb-3 text-sm">{t("size")}</h3>
              <div className="flex gap-3">
                {availableSizes.map((size) => {
                  const sizeDisplayPrice = size.name === "Large" && product.largePrice
                    ? product.largePrice
                    : product.basePrice + size.priceModifier;
                  
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-3 rounded-2xl transition-all duration-300 ${
                        currentSize.id === size.id
                          ? "bg-primary text-primary-foreground shadow-button"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      <p className="font-semibold text-sm">{size.name}</p>
                      {size.ml > 0 && <p className="text-[10px] opacity-70">{size.ml}ml</p>}
                      <p className="text-xs mt-0.5 font-medium">{sizeDisplayPrice} {t("egp")}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {product.addOns.length > 0 && (
            <div className="mb-5">
              <h3 className="font-semibold text-foreground mb-3 text-sm">
                {hasScoopAddOns ? t("scoops") : t("addOns")}
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {product.addOns.map((addOn) => {
                  const isSelected = selectedAddOns.find((a) => a.id === addOn.id);
                  const isScoop = isScoopAddOn(addOn.name);
                  
                  const scoopCount = addOn.name === "2 Scoops" ? 2 :
                                    addOn.name === "3 Scoops" ? 3 :
                                    addOn.name === "4 Scoops" ? 4 :
                                    addOn.name === "5 Scoops" ? 5 : 1;
                  const scoopPrice = isScoop ? product.basePrice * scoopCount : 0;
                  
                  const displayAddonName = addOn.name === "2 Scoops" ? t("twoScoops") :
                                     addOn.name === "3 Scoops" ? t("threeScoops") :
                                     addOn.name === "4 Scoops" ? t("fourScoops") :
                                     addOn.name === "5 Scoops" ? t("fiveScoops") : addOn.name;
                  return (
                    <button
                      key={addOn.id}
                      onClick={() => toggleAddOn(addOn)}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all duration-300 ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-button"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <span className="text-lg">{addOn.icon}</span>
                      <div className="text-start flex-1">
                        <p className={`font-medium text-xs ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>{displayAddonName}</p>
                        <p className={`text-[10px] ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {isScoop 
                            ? `${scoopPrice} ${t("egp")}` 
                            : addOn.price > 0 ? `+${addOn.price} ${t("egp")}` : t("free")}
                        </p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews placeholder matching reference */}
          <div className="mb-4">
            <h3 className="font-semibold text-foreground mb-3 text-sm">Reviews</h3>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-4 h-4 ${i <= 4 ? "text-secondary fill-secondary" : "text-muted"}`} />
              ))}
              <span className="text-xs text-muted-foreground ms-2">(4.0)</span>
            </div>
          </div>
        </div>

        {/* Footer - quantity + Add to Cart */}
        <div className="p-5 border-t border-border safe-bottom bg-card">
          <div className="flex items-center gap-4">
            {/* Quantity stepper */}
            <div className="flex items-center gap-2 bg-primary rounded-full p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
              >
                <Minus className="w-4 h-4 text-primary-foreground" />
              </button>
              <span className="w-6 text-center font-bold text-primary-foreground text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
              >
                <Plus className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>

            {/* Add to Cart */}
            <Button
              variant="golden"
              size="lg"
              className="flex-1 rounded-full h-12"
              onClick={handleAddToCart}
            >
              {t("addToCart")} · {totalPrice.toFixed(0)} {t("egp")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
