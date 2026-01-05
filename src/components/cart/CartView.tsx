import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

interface CartViewProps {
  onCheckout: () => void;
}

export const CartView = ({ onCheckout }: CartViewProps) => {
  const { items, updateQuantity, removeItem, subtotal, deliveryFee, tax, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 pb-24">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground text-center max-w-xs mb-6">
          Looks like you haven't added any delicious juices yet!
        </p>
        <Button variant="hero" size="lg">
          Browse Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 pb-40">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Your Cart</h2>
        <button 
          onClick={clearCart}
          className="text-destructive text-sm font-medium flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {items.map((item) => {
          const itemPrice =
            item.product.basePrice +
            item.selectedSize.priceModifier +
            item.selectedAddOns.reduce((a, addon) => a + addon.price, 0);

          return (
            <div
              key={item.id}
              className="bg-card rounded-2xl p-4 shadow-soft border border-border"
            >
              <div className="flex gap-4">
                {/* Product Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
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
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-foreground truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-1">
                    {item.selectedSize.name} • {item.selectedSize.ml}ml
                  </p>
                  {item.selectedAddOns.length > 0 && (
                    <p className="text-xs text-primary">
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
                <div className="text-right">
                  <p className="font-bold text-foreground">{(itemPrice * item.quantity).toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">EGP</p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-destructive text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>

                <div className="flex items-center gap-3 bg-muted rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shadow-sm"
                  >
                    <Minus className="w-4 h-4 text-foreground" />
                  </button>
                  <span className="w-6 text-center font-bold text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shadow-sm"
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
      <div className="bg-card rounded-2xl p-5 shadow-soft border border-border mb-6">
        <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground font-medium">{subtotal.toFixed(0)} EGP</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="text-foreground font-medium">{deliveryFee.toFixed(0)} EGP</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAT (14%)</span>
            <span className="text-foreground font-medium">{tax.toFixed(0)} EGP</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border">
            <span className="font-bold text-foreground">Total</span>
            <span className="font-bold text-primary text-lg">{total.toFixed(0)} EGP</span>
          </div>
        </div>
      </div>

      {/* Fixed Checkout Button */}
      <div className="fixed bottom-20 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <Button 
          variant="hero" 
          size="xl" 
          className="w-full"
          onClick={onCheckout}
        >
          Proceed to Checkout
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
