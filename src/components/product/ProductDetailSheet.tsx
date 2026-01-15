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

  // Use product's sizes or default sizes
  const availableSizes = product.sizes.length > 0 ? product.sizes : defaultSizes;
  const currentSize = selectedSize || availableSizes[0];

  const productImage = getCategoryImage(product.categoryId, categoryName);

  // Check if add-on is a scoop add-on
  const isScoopAddOn = (name: string) => ["2 Scoops", "3 Scoops", "4 Scoops"].includes(name);
  const hasScoopAddOns = product.addOns.some(a => isScoopAddOn(a.name));

  const toggleAddOn = (addOn: AddOn) => {
    // For scoop add-ons, make them mutually exclusive (single select)
    if (isScoopAddOn(addOn.name)) {
      setSelectedAddOns((prev) => {
        const isCurrentlySelected = prev.find((a) => a.id === addOn.id);
        if (isCurrentlySelected) {
          // Deselect - go back to 1 scoop
          return prev.filter((a) => !isScoopAddOn(a.name));
        } else {
          // Select this scoop, remove any other scoop selections
          return [...prev.filter((a) => !isScoopAddOn(a.name)), addOn];
        }
      });
    } else {
      // Regular add-ons: toggle normally
      setSelectedAddOns((prev) =>
        prev.find((a) => a.id === addOn.id)
          ? prev.filter((a) => a.id !== addOn.id)
          : [...prev, addOn]
      );
    }
  };

  const toggleIngredient = (ingredient: string) => {
    setExcludedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  // Calculate number of scoops for Gelato
  const getNumberOfScoops = () => {
    const scoopAddOn = selectedAddOns.find(a => isScoopAddOn(a.name));
    if (!scoopAddOn) return 1;
    if (scoopAddOn.name === "2 Scoops") return 2;
    if (scoopAddOn.name === "3 Scoops") return 3;
    if (scoopAddOn.name === "4 Scoops") return 4;
    return 1;
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (hasScoopAddOns) {
      // Gelato: price = basePrice × number of scoops × quantity
      const scoops = getNumberOfScoops();
      return product.basePrice * scoops * quantity;
    } else {
      // Regular products: basePrice + size modifier + add-ons
      return (product.basePrice +
        currentSize.priceModifier +
        selectedAddOns.reduce((sum, a) => sum + a.price, 0)) * quantity;
    }
  };

  const totalPrice = calculateTotalPrice();

  const handleAddToCart = () => {
    addItem(product, currentSize, selectedAddOns, excludedIngredients, quantity);
    onClose();
    // Reset state
    setSelectedSize(null);
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
        dir={direction}
      >
        {/* Header Image */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={productImage} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 end-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-12rem)] hide-scrollbar">
          {/* Title & Price */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {language === "ar" ? product.description || product.name : product.name}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {language === "ar" ? product.name : product.description}
              </p>
            </div>
            <div className="text-end">
              <p className="text-2xl font-bold text-primary">{product.basePrice}</p>
              <p className="text-muted-foreground text-xs">{t("egp")}</p>
            </div>
          </div>

          {/* Calories */}
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">{product.calories} {t("calories")}</span>
          </div>

          {/* Size Selection - only show if there are multiple sizes with ml > 0 */}
          {availableSizes.length > 1 && availableSizes.some(s => s.ml > 0) && (
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">{t("size")}</h3>
              <div className="flex gap-3">
                {availableSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-3 rounded-2xl border-2 transition-all duration-200 ${
                      currentSize.id === size.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{size.name}</p>
                    {size.ml > 0 && <p className="text-xs text-muted-foreground">{size.ml}ml</p>}
                    {size.priceModifier > 0 && (
                      <p className="text-xs text-primary mt-1">+{size.priceModifier} {t("egp")}</p>
                    )}
                  </button>
                ))}
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
                  
                  // Get scoop count and calculate price for scoops
                  const scoopCount = addOn.name === "2 Scoops" ? 2 :
                                    addOn.name === "3 Scoops" ? 3 :
                                    addOn.name === "4 Scoops" ? 4 : 1;
                  const scoopPrice = isScoop ? product.basePrice * scoopCount : 0;
                  
                  // Translate scoop names
                  const displayName = addOn.name === "2 Scoops" ? t("twoScoops") :
                                     addOn.name === "3 Scoops" ? t("threeScoops") :
                                     addOn.name === "4 Scoops" ? t("fourScoops") : addOn.name;
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
                      <div className="text-start flex-1">
                        <p className="font-medium text-foreground text-sm">{displayName}</p>
                        <p className="text-xs text-muted-foreground">
                          {isScoop 
                            ? `${scoopPrice} ${t("egp")}` 
                            : addOn.price > 0 ? `+${addOn.price} ${t("egp")}` : t("free")}
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
          )}

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-card safe-bottom">
          <div className="flex items-center gap-4 mb-4">
            {/* Quantity */}
            <div className="flex items-center gap-3 bg-secondary rounded-2xl p-2">
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
              variant="default"
              size="lg"
              className="flex-1 shadow-button"
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