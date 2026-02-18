import { useEffect, useState } from "react";
import { Package, Clock, ChefHat, Check, X, MapPin, Truck, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface Order {
  id: string;
  status: string;
  customer_name: string | null;
  total_amount: number;
  order_type: string | null;
  delivery_address: string | null;
  created_at: string;
}

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", labelAr: "تم الطلب", icon: Clock, color: "text-primary", bgColor: "bg-primary" },
  { key: "confirmed", label: "Confirmed", labelAr: "تم التأكيد", icon: Check, color: "text-primary", bgColor: "bg-primary" },
  { key: "preparing", label: "Preparation", labelAr: "التحضير", icon: ChefHat, color: "text-primary", bgColor: "bg-primary" },
  { key: "ready", label: "Packaging", labelAr: "التغليف", icon: Package, color: "text-primary", bgColor: "bg-primary" },
  { key: "out_for_delivery", label: "Delivery", labelAr: "التوصيل", icon: Truck, color: "text-primary", bgColor: "bg-primary" },
  { key: "completed", label: "Completed", labelAr: "مكتمل", icon: Check, color: "text-primary", bgColor: "bg-primary" },
];

const getEstimatedTime = (status: string, orderType: string | null): { min: number; max: number } => {
  const isDelivery = orderType === "delivery";
  switch (status) {
    case "pending":
      return isDelivery ? { min: 30, max: 45 } : { min: 15, max: 25 };
    case "confirmed":
      return isDelivery ? { min: 25, max: 40 } : { min: 12, max: 22 };
    case "preparing":
      return isDelivery ? { min: 20, max: 35 } : { min: 8, max: 18 };
    case "ready":
      return isDelivery ? { min: 15, max: 25 } : { min: 2, max: 5 };
    case "out_for_delivery":
      return { min: 10, max: 20 };
    default:
      return { min: 15, max: 30 };
  }
};

export const OrderTracker = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["pending", "confirmed", "preparing", "ready", "out_for_delivery"])
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();

    const channel = supabase
      .channel("order-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((order) =>
                order.id === payload.new.id ? (payload.new as Order) : order
              ).filter((order) => 
                ["pending", "confirmed", "preparing", "ready", "out_for_delivery"].includes(order.status)
              )
            );
          } else if (payload.eventType === "INSERT") {
            const newOrder = payload.new as Order;
            if (["pending", "confirmed", "preparing", "ready", "out_for_delivery"].includes(newOrder.status)) {
              setOrders((prev) => [newOrder, ...prev]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="p-5">
        <div className="space-y-4">
          <div className="h-32 bg-card rounded-2xl shimmer shadow-card" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-5 text-center">
        <p className="text-muted-foreground">{t("signInToTrack") || "Sign in to track your orders"}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return null;
  }

  const getDisplaySteps = (orderType: string | null) => {
    if (orderType === "delivery") {
      return STATUS_STEPS.filter(s => s.key !== "completed");
    }
    return STATUS_STEPS.filter(s => s.key !== "out_for_delivery" && s.key !== "completed");
  };

  return (
    <section className="px-5 py-4">
      <h3 className="font-display text-lg font-bold text-foreground mb-4">
        {language === "ar" ? "الطلبات النشطة 📦" : "Active Orders 📦"}
      </h3>

      <div className="space-y-4">
        {orders.map((order, orderIndex) => {
          const displaySteps = getDisplaySteps(order.order_type);
          const currentStepIndex = displaySteps.findIndex(s => s.key === order.status);
          const currentStep = currentStepIndex === -1 ? 0 : currentStepIndex;
          const isCancelled = order.status === "cancelled";
          const estimatedTime = getEstimatedTime(order.status, order.order_type);
          const currentStatusStep = displaySteps[currentStep];

          return (
            <div
              key={order.id}
              style={{ animationDelay: `${orderIndex * 100}ms` }}
              className="bg-card rounded-3xl p-5 overflow-hidden animate-scale-in shadow-card floating"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-display font-bold text-foreground text-lg">
                    {language === "ar" ? "طلب" : "Order"} #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US", { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className="font-bold text-primary text-xl">
                  {order.total_amount.toFixed(0)} {language === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>

              {!isCancelled && (
                <div className="bg-muted rounded-2xl p-4 mb-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Timer className="w-6 h-6 text-primary glow-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {language === "ar" ? "الوقت المتوقع" : "Estimated Time"}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {estimatedTime.min}-{estimatedTime.max} <span className="text-sm font-medium">{language === "ar" ? "دقيقة" : "min"}</span>
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl text-xs font-bold text-primary-foreground bg-primary shadow-button">
                    {language === "ar" ? currentStatusStep?.labelAr : currentStatusStep?.label}
                  </div>
                </div>
              )}

              {order.order_type === "delivery" && order.delivery_address && (
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground bg-muted rounded-xl px-3 py-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="truncate">{order.delivery_address}</span>
                </div>
              )}

              {isCancelled ? (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-xl px-4 py-3">
                  <X className="w-5 h-5" />
                  <span className="font-medium">{language === "ar" ? "تم إلغاء الطلب" : "Order Cancelled"}</span>
                </div>
              ) : (
                <div className="relative pt-2">
                  <div className="absolute top-7 left-5 right-5 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${(currentStep / (displaySteps.length - 1)) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    {displaySteps.map((step, index) => {
                      const isCompleted = index <= currentStep;
                      const isCurrent = index === currentStep;
                      const Icon = step.icon;

                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                              isCompleted
                                ? "bg-primary text-primary-foreground shadow-button"
                                : "bg-muted text-muted-foreground"
                            } ${isCurrent ? "ring-4 ring-primary/30 scale-110 glow-pulse" : ""}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-[10px] mt-2 text-center max-w-[60px] leading-tight font-medium ${
                              isCompleted ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {language === "ar" ? step.labelAr : step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
