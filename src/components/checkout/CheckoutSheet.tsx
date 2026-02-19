import { useState } from "react";
import { X, User, Phone, FileText, CreditCard, Loader2, MapPin, Truck, Building, Layers, Home, Navigation, CheckCircle2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useDeliveryZones } from "@/hooks/useDeliveryZones";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

const orderSchema = z.object({
  customerName: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  customerPhone: z.string().trim().regex(/^\d{10,15}$/, "Invalid phone number"),
  notes: z.string().trim().max(500, "Notes too long").optional(),
  streetAddress: z.string().trim().max(200, "Address too long").optional(),
  building: z.string().trim().max(100, "Building too long").optional(),
  floor: z.string().trim().max(10, "Floor too long").optional(),
  apartment: z.string().trim().max(20, "Apartment too long").optional(),
  landmark: z.string().trim().max(200, "Landmark too long").optional(),
});

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

type PaymentMethod = "instapay" | "cash";

export const CheckoutSheet = ({ isOpen, onClose, onSuccess }: CheckoutSheetProps) => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { data: deliveryZones = [] } = useDeliveryZones();
  const { t, direction } = useLanguage();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  
  const [streetAddress, setStreetAddress] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [landmark, setLandmark] = useState("");

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId);
  const deliveryFee = selectedZone?.fee || 0;
  const isDelivery = selectedZone?.name !== "Pickup";
  const total = subtotal + deliveryFee;

  const getFullAddress = () => {
    const parts = [streetAddress, building, floor && `Floor ${floor}`, apartment && `Apt ${apartment}`, landmark].filter(Boolean);
    return parts.join(", ");
  };

  const handleFillAll = () => {
    if (!streetAddress) setStreetAddress("123 Main Street");
    if (!building) setBuilding("Building A");
    if (!floor) setFloor("3");
    if (!apartment) setApartment("5");
    if (!landmark) setLandmark("Near Central Mall");
  };

  const handleClearAll = () => {
    setStreetAddress("");
    setBuilding("");
    setFloor("");
    setApartment("");
    setLandmark("");
  };

  const handleSubmitOrder = async () => {
    const validation = orderSchema.safeParse({
      customerName,
      customerPhone,
      notes: notes || undefined,
      streetAddress: streetAddress || undefined,
      building: building || undefined,
      floor: floor || undefined,
      apartment: apartment || undefined,
      landmark: landmark || undefined,
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    if (!selectedZoneId) {
      toast.error(t("pleaseSelectOrderType"));
      return;
    }
    if (isDelivery && !streetAddress.trim()) {
      toast.error(t("pleaseEnterAddress"));
      return;
    }
    if (!paymentMethod) {
      toast.error(t("pleaseSelectPayment"));
      return;
    }

    setIsSubmitting(true);

    try {
      const fullAddress = getFullAddress();
      
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
          delivery_address: isDelivery ? fullAddress : null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

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

      toast.success(t("orderPlacedSuccess"), {
        description: `${t("orderNotification")} #${order.id.slice(0, 8)}`,
      });

      clearCart();
      onSuccess(order.id);
      onClose();

      setCustomerName("");
      setCustomerPhone("");
      setNotes("");
      setSelectedZoneId("");
      setStreetAddress("");
      setBuilding("");
      setFloor("");
      setApartment("");
      setLandmark("");
      setPaymentMethod("cash");
    } catch (error: any) {
      toast.error(t("failedToPlaceOrder"), {
        description: "Something went wrong. Please try again.",
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
        {/* Header */}
        <div className="relative p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">{t("checkout")}</h2>
            <p className="text-sm text-muted-foreground">{items.length} {t("items")}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center transition-transform hover:scale-110"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-12rem)] hide-scrollbar">
          <div className="space-y-4">
            {/* Customer Name */}
            <div>
              <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-primary" />
                {t("yourName")}
              </Label>
              <Input
                id="name"
                placeholder={t("enterYourName")}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                maxLength={100}
                className="h-12 rounded-3xl bg-background border-border px-5"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-primary" />
                {t("phoneNumber")}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                maxLength={15}
                className="h-12 rounded-3xl bg-background border-border px-5"
              />
            </div>

            {/* Delivery Zone Selection */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-primary" />
                {t("orderType")}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {deliveryZones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => {
                      setSelectedZoneId(zone.id);
                      if (zone.name === "Pickup") {
                        handleClearAll();
                      }
                    }}
                    className={`p-3 rounded-2xl text-start transition-all duration-300 ${
                      selectedZoneId === zone.id
                        ? "bg-primary text-primary-foreground shadow-button"
                        : "bg-card shadow-card border border-border hover:shadow-elevated"
                    }`}
                  >
                    <div className={`font-medium text-sm ${selectedZoneId === zone.id ? "text-primary-foreground" : "text-foreground"}`}>{zone.name}</div>
                    <div className={`text-xs ${selectedZoneId === zone.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {zone.fee === 0 ? t("free") : `+${zone.fee} ${t("egp")}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Address Details */}
            {isDelivery && selectedZoneId && (
              <div className="animate-fade-in bg-card rounded-3xl p-4 space-y-4 shadow-card border border-border">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-base font-medium">
                    <MapPin className="w-4 h-4 text-primary" />
                    {t("addressDetails")}
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleFillAll}
                      className="text-xs h-7 rounded-full"
                    >
                      <CheckCircle2 className="w-3 h-3 me-1" />
                      {t("fillAllFields")}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="text-xs h-7"
                    >
                      {t("clearAllFields")}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="street" className="flex items-center gap-2 mb-2 text-sm">
                    <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
                    {t("streetAddress")}
                  </Label>
                  <Input
                    id="street"
                    placeholder={t("enterStreetAddress")}
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="h-11 rounded-3xl bg-background border-border px-5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="building" className="flex items-center gap-2 mb-2 text-sm">
                      <Building className="w-3.5 h-3.5 text-muted-foreground" />
                      {t("building")}
                    </Label>
                    <Input
                      id="building"
                      placeholder={t("enterBuilding")}
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      className="h-11 rounded-3xl bg-background border-border px-5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="floor" className="flex items-center gap-2 mb-2 text-sm">
                      <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                      {t("floor")}
                    </Label>
                    <Input
                      id="floor"
                      placeholder={t("enterFloor")}
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      className="h-11 rounded-3xl bg-background border-border px-5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="apartment" className="flex items-center gap-2 mb-2 text-sm">
                      <Home className="w-3.5 h-3.5 text-muted-foreground" />
                      {t("apartment")}
                    </Label>
                    <Input
                      id="apartment"
                      placeholder={t("enterApartment")}
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="h-11 rounded-3xl bg-background border-border px-5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="landmark" className="flex items-center gap-2 mb-2 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {t("landmark")}
                    </Label>
                    <Input
                      id="landmark"
                      placeholder={t("enterLandmark")}
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="h-11 rounded-3xl bg-background border-border px-5"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onSelect={setPaymentMethod}
            />

            {/* InstaPay Instructions */}
            {paymentMethod === "instapay" && (
              <div className="animate-fade-in bg-card border border-green-500/20 rounded-3xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">{t("instaPayInstructions")}</span>
                </div>
                <div className="space-y-2 text-sm text-foreground/80">
                  <p>1. {t("instaPayStep1")}</p>
                  <p>2. {t("instaPayStep2")}</p>
                  <p>3. {t("instaPayStep3")}</p>
                </div>
                <div className="bg-muted rounded-2xl p-3 border border-green-500/20">
                  <p className="text-xs text-muted-foreground mb-1">{t("instaPayNumber")}</p>
                  <p className="font-mono text-lg font-bold text-green-700 select-all">01012345678</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("instaPayName")}: Mr. Juice</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("instaPayNote")}
                </p>
              </div>
            )}

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                {t("specialInstructions")}
              </Label>
              <Textarea
                id="notes"
                placeholder={t("anySpecialRequests")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                className="min-h-20 rounded-3xl bg-background border-border px-5"
              />
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-3xl p-4 space-y-2 shadow-card border border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="text-foreground font-medium">{subtotal.toFixed(0)} {t("egp")}</span>
              </div>
              {selectedZoneId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {isDelivery ? t("deliveryFee") : t("pickup")}
                  </span>
                  <span className="text-foreground font-medium">
                    {deliveryFee === 0 ? t("free") : `${deliveryFee.toFixed(0)} ${t("egp")}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2 border-t border-border">
                <span className="text-foreground">{t("total")}</span>
                <span className="text-primary text-xl">{total.toFixed(0)} {t("egp")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-card safe-bottom">
          <Button
            variant="default"
            size="xl"
            className="w-full rounded-full"
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 me-2 animate-spin" />
                {t("placingOrder")}
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 me-2" />
                {t("placeOrder")} • {total.toFixed(0)} {t("egp")}
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};
