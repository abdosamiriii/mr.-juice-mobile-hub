import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import logoImage from "@/assets/mr-juice-logo-new.jpg";

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
        <div className="w-24 h-24 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">{t("cartEmpty")}</h2>
        <p className="text-muted-foreground text-center max-w-xs mb-6">
          {t("cartEmptyDescription")}
        </p>
        <Button variant="default" size="lg" className="rounded-full" onClick={onBrowseMenu}>
          {t("browseMenu")}
        </Button>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 pb-40" dir={direction}>
      {/* Header matching reference: back arrow + logo + "My Cart" */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <img src={logoImage} alt="MR. Juice" className="w-7 h-7 rounded-full object-cover" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">{t("yourCart")}</h2>
        </div>
        <button 
          onClick={clearCart}
          className="text-destructive text-sm font-medium flex items-center gap-1 px-3 py-1.5 rounded-full bg-destructive/10 transition-all hover:bg-destructive/20"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {t("clear")}
        </button>
      </div>

      {/* Cart Items - reference style: pink-tinted rows with round product image */}
      <div className="space-y-4 mb-6">
        {items.map((item, index) => {
          const itemPrice =
            item.product.basePrice +
            item.selectedSize.priceModifier +
            item.selectedAddOns.reduce((a, addon) => a + addon.price, 0);

          return (
            <div
              key={item.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="bg-juice-pink/8 rounded-3xl p-4 animate-scale-in"
            >
              <div className="flex gap-3 items-start">
                {/* Round product thumbnail */}
                <div className="w-16 h-16 rounded-2xl bg-juice-pink/15 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  <span className="text-3xl">🍹</span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-foreground text-sm truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-primary font-bold text-base mt-0.5">
                    {(itemPrice * item.quantity).toFixed(2)} {t("egp")}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <button className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Heart className="w-3 h-3" /> Favorite
                    </button>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1 text-muted-foreground text-xs"
                    >
                      <Trash2 className="w-3 h-3" /> {t("remove")}
                    </button>
                  </div>
                </div>

                {/* Quantity controls - purple vertical stepper matching reference */}
                <div className="flex flex-col items-center gap-1 bg-primary rounded-2xl p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-xl bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-primary-foreground" />
                  </button>
                  <span className="text-sm font-bold text-primary-foreground py-0.5">
                    {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-xl bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary - reference style */}
      <div className="bg-card rounded-3xl p-5 mb-6 shadow-card">
        <div className="space-y-2 text-sm">
          {items.map((item) => {
            const itemPrice =
              item.product.basePrice +
              item.selectedSize.priceModifier +
              item.selectedAddOns.reduce((a, addon) => a + addon.price, 0);
            return (
              <div key={item.id} className="flex justify-between">
                <span className="text-muted-foreground">{item.quantity} x {item.product.name}</span>
                <span className="text-foreground font-medium">{(itemPrice * item.quantity).toFixed(2)}</span>
              </div>
            );
          })}
          <div className="border-t border-border pt-2 mt-2" />
          <p className="text-xs text-muted-foreground">{t("deliveryFeeNote")}</p>
        </div>
      </div>

      {/* Fixed bottom checkout button - pink matching reference */}
      <div className="fixed bottom-20 left-0 right-0 p-5 bg-gradient-to-t from-background via-background/95 to-transparent">
        <Button 
          variant="pink" 
          size="xl" 
          className="w-full rounded-full"
          onClick={onCheckout}
        >
          {t("proceedToCheckout")} · {subtotal.toFixed(2)} {t("egp")}
          <ArrowRight className={`w-5 h-5 ${direction === "rtl" ? "rotate-180" : ""}`} />
        </Button>
      </div>
    </div>
  );
};
