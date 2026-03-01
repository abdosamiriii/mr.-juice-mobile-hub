import { useState, useEffect } from "react";
import { Package, MapPin, Trash2, RefreshCw, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  product_name: string;
  size_name: string | null;
  quantity: number;
  unit_price: number;
  add_ons: unknown;
}

interface DisplayAddOn {
  name: string;
  price: number;
}

const parseAddOns = (addOns: unknown): DisplayAddOn[] => {
  if (!addOns || !Array.isArray(addOns)) return [];
  return addOns.filter((a): a is DisplayAddOn => 
    typeof a === 'object' && a !== null && 'name' in a && 'price' in a
  );
};

interface Order {
  id: string;
  status: string;
  customer_name: string | null;
  total_amount: number;
  order_type: string | null;
  delivery_address: string | null;
  delivery_fee: number | null;
  notes: string | null;
  created_at: string;
  order_items: OrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

interface OrderHistoryProps {
  onReorder?: (items: OrderItem[]) => void;
}

export const OrderHistory = ({ onReorder }: OrderHistoryProps) => {
  const { user } = useAuth();
  const { t, language, direction } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: t("pending"),
      confirmed: t("confirmed"),
      preparing: t("preparing"),
      ready: t("ready"),
      completed: t("completed"),
      cancelled: t("cancelled"),
    };
    return statusMap[status] || status;
  };

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleDelete = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order && order.status !== "pending") {
      toast.error(language === "ar" ? "لا يمكن حذف طلب قيد التنفيذ" : "Only pending orders can be deleted");
      return;
    }

    setDeletingId(orderId);
    
    // First delete order items
    await supabase
      .from("order_items")
      .delete()
      .eq("order_id", orderId);
    
    // Then delete the order
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      toast.error(t("failedToDelete"));
    } else {
      toast.success(t("orderDeleted"));
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    }
    setDeletingId(null);
  };

  const handleReorder = (order: Order) => {
    if (onReorder) {
      onReorder(order.order_items);
      toast.success(t("itemsAddedToCart"));
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  if (loading) {
    return (
      <div className="p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-muted rounded-2xl" />
          <div className="h-24 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-5 text-center py-20" dir={direction}>
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{t("signInToViewOrders")}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-5 text-center py-20" dir={direction}>
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-xl font-semibold text-foreground mb-2">{t("noOrders")}</p>
        <p className="text-muted-foreground">{t("noOrdersDescription")}</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4" dir={direction}>
      {orders.map((order) => {
        const isExpanded = expandedOrder === order.id;
        const isDeleting = deletingId === order.id;

        return (
          <div
            key={order.id}
            className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden"
          >
            {/* Header */}
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(order.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">
                      {t("orders")} #{order.id.slice(0, 8)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(order.created_at).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")} 
                      {" "}
                      {new Date(order.created_at).toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary text-lg">
                    {order.total_amount.toFixed(0)} {t("egp")}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {order.order_type === "delivery" && order.delivery_address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{order.delivery_address}</span>
                </div>
              )}

              <p className="text-sm text-muted-foreground mt-1">
                {order.order_items.length} {order.order_items.length !== 1 ? t("items") : t("items")}
                {order.delivery_fee && order.delivery_fee > 0 && (
                  <span> • {t("deliveryFee")}: {order.delivery_fee.toFixed(0)} {t("egp")}</span>
                )}
              </p>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t border-border">
                {/* Order Items */}
                <div className="p-4 space-y-3">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {item.quantity}x {item.product_name}
                        </p>
                        {item.size_name && (
                          <p className="text-muted-foreground text-xs">
                            {t("size")}: {item.size_name}
                          </p>
                        )}
                        {parseAddOns(item.add_ons).length > 0 && (
                          <p className="text-muted-foreground text-xs">
                            {t("addOns")}: {parseAddOns(item.add_ons).map((a) => a.name).join(", ")}
                          </p>
                        )}
                      </div>
                      <span className="text-foreground font-medium">
                        {(item.unit_price * item.quantity).toFixed(0)} {t("egp")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">{t("specialInstructions")}:</span> {order.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="p-4 bg-muted/30 flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleReorder(order)}
                  >
                    <RefreshCw className="w-4 h-4 me-2" />
                    {t("reorder")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(order.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 me-2" />
                    {isDeleting ? t("deleting") : t("delete")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};