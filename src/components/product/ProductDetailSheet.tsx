import { useState } from "react";
import { X, Minus, Plus, Check, Leaf } from "lucide-react";
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
        className={`fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-[2rem] max-h-[90vh] overflow-hidden transition-transform duration-300 shadow-elevated ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        dir={direction}
      >
        {/* Header Image */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={productImage} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-soft z-10 transition-transform hover:scale-110"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          
          {/* Product title overlay */}
          <div className="absolute bottom-4 start-4 end-4">
            <h2 className="font-display text-2xl font-bold text-white drop-shadow-lg">
              {language === "ar" ? product.description || product.name : product.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-12rem)] hide-scrollbar">
          {/* Title & Price */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">
                {language === "ar" ? product.name : product.description}
              </p>
            </div>
            <div className="text-end bg-secondary rounded-2xl px-4 py-2">
              <p className="text-2xl font-bold text-secondary-foreground">{product.basePrice}</p>
              <p className="text-secondary-foreground/60 text-xs">{t("egp")}</p>
            </div>
          </div>

          {/* Calories */}
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-muted rounded-full px-3 py-1.5 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">{product.calories} {t("calories")}</span>
            </div>
          </div>

          {/* Size Selection */}
          {availableSizes.length > 1 && availableSizes.some(s => s.ml > 0) && (
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">{t("size")}</h3>
              <div className="flex gap-3">
                {availableSizes.map((size) => {
                  const sizeDisplayPrice = size.name === "Large" && product.largePrice
                    ? product.largePrice
                    : product.basePrice + size.priceModifier;
                  
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-3 rounded-2xl transition-all duration-300 floating ${
                        currentSize.id === size.id
                          ? "bg-primary text-primary-foreground shadow-button"
                          : "bg-card shadow-card hover:shadow-elevated"
                      }`}
                    >
                      <p className={`font-semibold ${currentSize.id === size.id ? "text-primary-foreground" : "text-foreground"}`}>{size.name}</p>
                      {size.ml > 0 && <p className={`text-xs ${currentSize.id === size.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{size.ml}ml</p>}
                      <p className={`text-xs mt-1 font-medium ${currentSize.id === size.id ? "text-primary-foreground" : "text-primary"}`}>{sizeDisplayPrice} {t("egp")}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {product.addOns.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">
                {hasScoopAddOns ? t("scoops") : t("addOns")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {product.addOns.map((addOn) => {
                  const isSelected = selectedAddOns.find((a) => a.id === addOn.id);
                  const isScoop = isScoopAddOn(addOn.name);
                  
                  const scoopCount = addOn.name === "2 Scoops" ? 2 :
                                    addOn.name === "3 Scoops" ? 3 :
                                    addOn.name === "4 Scoops" ? 4 :
                                    addOn.name === "5 Scoops" ? 5 : 1;
                  const scoopPrice = isScoop ? product.basePrice * scoopCount : 0;
                  
                  const displayName = addOn.name === "2 Scoops" ? t("twoScoops") :
                                     addOn.name === "3 Scoops" ? t("threeScoops") :
                                     addOn.name === "4 Scoops" ? t("fourScoops") :
                                     addOn.name === "5 Scoops" ? t("fiveScoops") : addOn.name;
                  return (
                    <button
                      key={addOn.id}
                      onClick={() => toggleAddOn(addOn)}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 floating ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-button"
                          : "bg-card shadow-card hover:shadow-elevated"
                      }`}
                    >
                      <span className="text-xl">{addOn.icon}</span>
                      <div className="text-start flex-1">
                        <p className={`font-medium text-sm ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>{displayName}</p>
                        <p className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {isScoop 
                            ? `${scoopPrice} ${t("egp")}` 
                            : addOn.price > 0 ? `+${addOn.price} ${t("egp")}` : t("free")}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-primary-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border safe-bottom bg-card">
          <div className="flex items-center gap-4 mb-4">
            {/* Quantity */}
            <div className="flex items-center gap-3 bg-primary rounded-2xl p-1.5">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
              >
                <Minus className="w-4 h-4 text-primary-foreground" />
              </button>
              <span className="w-8 text-center font-bold text-primary-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
              >
                <Plus className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              variant="golden"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
            >
              {t("addToCart")} • {totalPrice.toFixed(0)} {t("egp")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
