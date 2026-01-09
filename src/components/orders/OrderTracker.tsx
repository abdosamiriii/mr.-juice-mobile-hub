import { useEffect, useState } from "react";
import { Package, Clock, ChefHat, Check, X, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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
  { key: "pending", label: "Order Placed", icon: Clock, color: "text-yellow-500" },
  { key: "confirmed", label: "Confirmed", icon: Check, color: "text-blue-500" },
  { key: "preparing", label: "Preparing", icon: ChefHat, color: "text-orange-500" },
  { key: "ready", label: "Ready", icon: Package, color: "text-green-500" },
  { key: "completed", label: "Completed", icon: Check, color: "text-primary" },
];

const getStatusIndex = (status: string) => {
  const index = STATUS_STEPS.findIndex((s) => s.key === status);
  return index === -1 ? 0 : index;
};

export const OrderTracker = () => {
  const { user } = useAuth();
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
        .in("status", ["pending", "confirmed", "preparing", "ready"])
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();

    // Subscribe to real-time updates
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
                ["pending", "confirmed", "preparing", "ready"].includes(order.status)
              )
            );
          } else if (payload.eventType === "INSERT") {
            const newOrder = payload.new as Order;
            if (["pending", "confirmed", "preparing", "ready"].includes(newOrder.status)) {
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
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-5 text-center">
        <p className="text-muted-foreground">Sign in to track your orders</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return null;
  }

  return (
    <section className="px-5 py-4">
      <h3 className="font-display text-lg font-bold text-foreground mb-4">
        Active Orders 📦
      </h3>

      <div className="space-y-4">
        {orders.map((order) => {
          const currentStep = getStatusIndex(order.status);
          const isCancelled = order.status === "cancelled";

          return (
            <div
              key={order.id}
              className="bg-card rounded-2xl p-4 shadow-soft border border-border"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-medium text-foreground">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <span className="font-bold text-primary">
                  {order.total_amount.toFixed(0)} EGP
                </span>
              </div>

              {order.order_type === "delivery" && order.delivery_address && (
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{order.delivery_address}</span>
                </div>
              )}

              {isCancelled ? (
                <div className="flex items-center gap-2 text-destructive">
                  <X className="w-5 h-5" />
                  <span className="font-medium">Order Cancelled</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  {STATUS_STEPS.slice(0, 4).map((step, index) => {
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          } ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-xs mt-2 text-center ${
                            isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </span>
                        {index < 3 && (
                          <div
                            className={`absolute h-0.5 w-full top-5 -right-1/2 ${
                              index < currentStep ? "bg-primary" : "bg-muted"
                            }`}
                            style={{ display: "none" }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
