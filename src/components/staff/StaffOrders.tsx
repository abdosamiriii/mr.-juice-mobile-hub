import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Eye, MapPin, Phone, User, StickyNote, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { OrderStatus } from "@/hooks/useOrders";

interface StaffOrder {
  id: string;
  user_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  status: OrderStatus;
  total_amount: number;
  notes: string | null;
  order_type: string | null;
  delivery_address: string | null;
  delivery_zone_id: string | null;
  delivery_fee: number | null;
  created_at: string;
  updated_at: string;
  order_items: {
    id: string;
    order_id: string;
    product_id: string | null;
    product_name: string;
    size_name: string | null;
    quantity: number;
    unit_price: number;
    add_ons: { name: string; price: number }[] | null;
    created_at: string;
  }[];
}

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  preparing: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  ready: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  out_for_delivery: "bg-green-500/10 text-green-600 border-green-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed'];
const allStatuses: OrderStatus[] = [...statusFlow, 'cancelled'];

const getNextStatus = (current: OrderStatus): OrderStatus | null => {
  const idx = statusFlow.indexOf(current);
  if (idx === -1 || idx >= statusFlow.length - 1) return null;
  return statusFlow[idx + 1];
};

const getStaffPin = () => sessionStorage.getItem("staff_pin") || "";

export function StaffOrders() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<StaffOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("active");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["staff-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("staff_get_orders", { p_pin: getStaffPin() });
      if (error) throw error;
      return (data as unknown as StaffOrder[]) || [];
    },
    refetchInterval: 5000, // Poll every 5s for new orders
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase.rpc("staff_update_order_status", {
        p_pin: getStaffPin(),
        p_order_id: id,
        p_status: status,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-orders"] });
      toast.success("Order status updated");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const filteredOrders = orders?.filter(order => {
    if (statusFilter === "active") return !["completed", "cancelled"].includes(order.status);
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  }) || [];

  const activeCount = orders?.filter(o => !["completed", "cancelled"].includes(o.status)).length || 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <span className="font-bold text-foreground text-lg">Orders</span>
          {activeCount > 0 && (
            <Badge className="bg-primary text-primary-foreground">{activeCount}</Badge>
          )}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="all">All Orders</SelectItem>
            {allStatuses.map(s => (
              <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No orders</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const nextStatus = getNextStatus(order.status);
            return (
              <Card key={order.id} className="overflow-hidden border-border/50 shadow-sm">
                <CardContent className="p-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-foreground text-base">
                        #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <Badge className={`${statusColors[order.status]} text-xs`}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>

                  {/* Customer info */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {order.customer_name || "Guest"}
                    </span>
                    {order.customer_phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {order.customer_phone}
                      </span>
                    )}
                    {order.order_type === "delivery" && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        Delivery
                      </span>
                    )}
                  </div>

                  {/* Items summary */}
                  <div className="bg-muted/50 rounded-xl p-3 mb-3 text-sm">
                    {order.order_items?.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between py-0.5">
                        <span>
                          {item.quantity}× {item.product_name}
                          {item.size_name && <span className="text-muted-foreground"> ({item.size_name})</span>}
                        </span>
                        <span className="font-medium">{Number(item.unit_price).toFixed(0)} EGP</span>
                      </div>
                    ))}
                    {(order.order_items?.length || 0) > 3 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        +{order.order_items!.length - 3} more items
                      </p>
                    )}
                    <div className="border-t border-border/50 mt-2 pt-2 space-y-1">
                      {order.order_type === "delivery" && Number(order.delivery_fee) > 0 && (
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Delivery Fee</span>
                          <span>{Number(order.delivery_fee).toFixed(0)} EGP</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary">{Number(order.total_amount).toFixed(0)} EGP</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-yellow-500/5 border border-yellow-500/20 rounded-lg px-3 py-2 mb-3">
                      <StickyNote className="h-4 w-4 mt-0.5 text-yellow-600 shrink-0" />
                      <span>{order.notes}</span>
                    </div>
                  )}

                  {/* Delivery address */}
                  {order.order_type === "delivery" && order.delivery_address && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-3 py-2 mb-3">
                      <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>{order.delivery_address}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {nextStatus && order.status !== "cancelled" && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => updateStatus.mutate({ id: order.id, status: nextStatus })}
                        disabled={updateStatus.isPending}
                      >
                        {statusLabels[nextStatus]}
                        <ChevronRight className="h-4 w-4 ms-1" />
                      </Button>
                    )}
                    {order.status !== "cancelled" && order.status !== "completed" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: order.id, status: "cancelled" })}
                        disabled={updateStatus.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order #{selectedOrder?.id.slice(0, 8)}
              <Badge className={statusColors[selectedOrder?.status || 'pending']}>
                {statusLabels[selectedOrder?.status || 'pending']}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="font-medium">{selectedOrder?.customer_name || "Guest"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{selectedOrder?.customer_phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{selectedOrder?.order_type || "Pickup"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-primary">
                  {Number(selectedOrder?.total_amount || 0).toFixed(0)} EGP
                </p>
              </div>
            </div>

            {selectedOrder?.delivery_address && (
              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Delivery Address</p>
                  <p className="text-sm">{selectedOrder.delivery_address}</p>
                </div>
              </div>
            )}

            {selectedOrder?.notes && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{selectedOrder.notes}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Order Items</p>
              <ScrollArea className="max-h-60">
                <div className="space-y-2">
                  {selectedOrder?.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.size_name && `Size: ${item.size_name}`}
                          {item.quantity > 1 && ` × ${item.quantity}`}
                        </p>
                        {item.add_ons && item.add_ons.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Add-ons: {item.add_ons.map(a => a.name).join(", ")}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold">{Number(item.unit_price).toFixed(0)} EGP</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              {selectedOrder && format(new Date(selectedOrder.created_at), "EEEE, MMM d, yyyy 'at' h:mm a")}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
