import { useState } from "react";
import { X, User, Phone, FileText, CreditCard, Loader2, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useDeliveryZones } from "@/hooks/useDeliveryZones";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutSheet = ({ isOpen, onClose, onSuccess }: CheckoutSheetProps) => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { data: deliveryZones = [] } = useDeliveryZones();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId);
  const deliveryFee = selectedZone?.fee || 0;
  const isDelivery = selectedZone?.name !== "Pickup";
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = async () => {
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!customerPhone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!selectedZoneId) {
      toast.error("Please select pickup or delivery zone");
      return;
    }
    if (isDelivery && !deliveryAddress.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          notes: notes.trim() || null,
          total_amount: total,
          status: "pending",
          order_type: isDelivery ? "delivery" : "pickup",
          delivery_zone_id: selectedZoneId,
          delivery_fee: deliveryFee,
          delivery_address: isDelivery ? deliveryAddress.trim() : null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: null,
        product_name: item.product.name,
        size_name: item.selectedSize.name,
        quantity: item.quantity,
        unit_price:
          item.product.basePrice +
          item.selectedSize.priceModifier +
          item.selectedAddOns.reduce((sum, a) => sum + a.price, 0),
        add_ons: item.selectedAddOns.map((a) => ({ name: a.name, price: a.price })),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success("Order placed successfully! 🎉", {
        description: `Order #${order.id.slice(0, 8)} - We'll notify you when it's ready`,
      });

      clearCart();
      onSuccess();
      onClose();

      // Reset form
      setCustomerName("");
      setCustomerPhone("");
      setNotes("");
      setSelectedZoneId("");
      setDeliveryAddress("");
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error("Failed to place order", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) return null;

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
        {/* Header */}
        <div className="relative p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Checkout</h2>
            <p className="text-sm text-muted-foreground">{items.length} items</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-12rem)]">
          <div className="space-y-4">
            {/* Customer Name */}
            <div>
              <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-primary" />
                Your Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-primary" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Delivery Zone Selection */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-primary" />
                Order Type
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {deliveryZones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => {
                      setSelectedZoneId(zone.id);
                      if (zone.name === "Pickup") {
                        setDeliveryAddress("");
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedZoneId === zone.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium text-sm text-foreground">{zone.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {zone.fee === 0 ? "Free" : `+${zone.fee} EGP`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Address (only if delivery selected) */}
            {isDelivery && selectedZoneId && (
              <div className="animate-fade-in">
                <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Delivery Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your full delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="min-h-20"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                Special Instructions (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Any special requests?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-20"
              />
            </div>

            {/* Order Summary */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{subtotal.toFixed(0)} EGP</span>
              </div>
              {selectedZoneId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {isDelivery ? "Delivery Fee" : "Pickup"}
                  </span>
                  <span className="text-foreground">
                    {deliveryFee === 0 ? "Free" : `${deliveryFee.toFixed(0)} EGP`}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-primary">{total.toFixed(0)} EGP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-card safe-bottom">
          <Button
            variant="default"
            size="xl"
            className="w-full"
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Place Order • {total.toFixed(0)} EGP
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};
