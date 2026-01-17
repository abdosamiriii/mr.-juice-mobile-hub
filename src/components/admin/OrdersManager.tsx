import { useState } from "react";
import { useOrders, useUpdateOrderStatus, useOrderStats, OrderStatus, OrderWithItems } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingBag, Clock, CheckCircle, Eye, TrendingUp } from "lucide-react";
import { format } from "date-fns";

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
  preparing: "Preparation",
  ready: "Packaging",
  out_for_delivery: "Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusOptions: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'];

export function OrdersManager() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: stats, isLoading: statsLoading } = useOrderStats();
  const updateStatus = useUpdateOrderStatus();
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders?.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  ) || [];

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatus.mutate({ id: orderId, status: newStatus });
  };

  if (ordersLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold text-foreground">${stats?.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Today's Revenue</p>
                <p className="text-xl font-bold text-foreground">${stats?.todayRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold text-foreground">{stats?.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Orders</p>
                <p className="text-xl font-bold text-foreground">{stats?.pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Orders
          </CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        #{order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer_name || "Guest"}</p>
                          <p className="text-xs text-muted-foreground">{order.customer_phone || "-"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.order_items?.length || 0} items
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${Number(order.total_amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                        >
                          <SelectTrigger className={`w-32 h-8 ${statusColors[order.status]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(status => (
                              <SelectItem key={status} value={status}>
                                {statusLabels[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(order.created_at), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order #{selectedOrder?.id.slice(0, 8)}
              <Badge className={statusColors[selectedOrder?.status || 'pending']}>
                {selectedOrder?.status}
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
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">
                  {selectedOrder && format(new Date(selectedOrder.created_at), "MMM d, yyyy h:mm a")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-primary">
                  ${Number(selectedOrder?.total_amount || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {selectedOrder?.notes && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{selectedOrder.notes}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Order Items</p>
              <ScrollArea className="h-48">
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
                      <p className="font-semibold">${Number(item.unit_price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
