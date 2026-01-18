import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface CartViewProps {
  onCheckout: () => void;
  onBrowseMenu: () => void;
}

export const CartView = ({ onCheckout, onBrowseMenu }: CartViewProps) => {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  const { t, direction } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 pb-24">
        <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center mb-6 glossy-highlight">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">{t("cartEmpty")}</h2>
        <p className="text-muted-foreground text-center max-w-xs mb-6">
          {t("cartEmptyDescription")}
        </p>
        <Button variant="default" size="lg" onClick={onBrowseMenu} className="shadow-button glossy-highlight">
          {t("browseMenu")}
        </Button>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 pb-40">
      <div className={`flex items-center justify-between mb-6 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
        <h2 className="font-display text-2xl font-bold text-foreground">{t("yourCart")}</h2>
        <button 
          onClick={clearCart}
          className={`glass-button text-destructive text-sm font-medium flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all hover:bg-destructive/10 ${direction === "rtl" ? "flex-row-reverse" : ""}`}
        >
          <Trash2 className="w-4 h-4" />
          {t("clear")}
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {items.map((item, index) => {
          const itemPrice =
            item.product.basePrice +
            item.selectedSize.priceModifier +
            item.selectedAddOns.reduce((a, addon) => a + addon.price, 0);

          return (
            <div
              key={item.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="glass-card rounded-2xl p-4 animate-scale-in floating"
            >
              <div className={`flex gap-4 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
                {/* Product Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 glossy-highlight">
                  <span className="text-3xl">
                    {item.product.categoryId === "fresh-juice" && "🍊"}
                    {item.product.categoryId === "smoothies" && "🥤"}
                    {item.product.categoryId === "detox" && "🥬"}
                    {item.product.categoryId === "protein" && "💪"}
                    {item.product.categoryId === "classics" && "🥭"}
                    {item.product.categoryId === "seasonal" && "🍉"}
                  </span>
                </div>

                {/* Details */}
                <div className={`flex-1 min-w-0 ${direction === "rtl" ? "text-right" : ""}`}>
                  <h4 className="font-display font-bold text-foreground truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-1">
                    {item.selectedSize.name} • {item.selectedSize.ml}ml
                  </p>
                  {item.selectedAddOns.length > 0 && (
                    <p className="text-xs text-primary font-medium">
                      + {item.selectedAddOns.map((a) => a.name).join(", ")}
                    </p>
                  )}
                  {item.excludedIngredients.length > 0 && (
                    <p className="text-xs text-destructive">
                      No: {item.excludedIngredients.join(", ")}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className={direction === "rtl" ? "text-left" : "text-right"}>
                  <p className="font-bold text-foreground text-lg">{(itemPrice * item.quantity).toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">{t("egp")}</p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className={`flex items-center justify-between mt-4 pt-4 border-t border-border/50 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
                <button
                  onClick={() => removeItem(item.id)}
                  className={`text-destructive text-sm flex items-center gap-1 hover:bg-destructive/10 px-2 py-1 rounded-lg transition-all ${direction === "rtl" ? "flex-row-reverse" : ""}`}
                >
                  <Trash2 className="w-4 h-4" />
                  {t("remove")}
                </button>

                <div className="flex items-center gap-3 glass-button rounded-2xl p-1.5">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-xl bg-card flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4 text-foreground" />
                  </button>
                  <span className="w-6 text-center font-bold text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-xl bg-card flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="glass-card rounded-2xl p-5 mb-6">
        <h3 className={`font-semibold text-foreground mb-4 ${direction === "rtl" ? "text-right" : ""}`}>{t("orderSummary")}</h3>
        
        <div className="space-y-3 text-sm">
          <div className={`flex justify-between ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span className="text-foreground font-medium">{subtotal.toFixed(0)} {t("egp")}</span>
          </div>
          <p className={`text-xs text-muted-foreground ${direction === "rtl" ? "text-right" : ""}`}>
            {t("deliveryFeeNote")}
          </p>
          <div className={`flex justify-between pt-3 border-t border-border/50 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <span className="font-bold text-foreground">{t("subtotal")}</span>
            <span className="font-bold text-primary text-lg">{subtotal.toFixed(0)} {t("egp")}</span>
          </div>
        </div>
      </div>

      {/* Fixed Checkout Button */}
      <div className="fixed bottom-20 left-0 right-0 p-5 bg-gradient-to-t from-background via-background/95 to-transparent">
        <Button 
          variant="default" 
          size="xl" 
          className={`w-full shadow-button glossy-highlight ${direction === "rtl" ? "flex-row-reverse" : ""}`}
          onClick={onCheckout}
        >
          {t("proceedToCheckout")}
          <ArrowRight className={`w-5 h-5 ${direction === "rtl" ? "mr-2 rotate-180" : "ml-2"}`} />
        </Button>
      </div>
    </div>
  );
};
