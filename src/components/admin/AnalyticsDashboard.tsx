import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, DollarSign, ShoppingBag, Users, Star, Clock } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function AnalyticsDashboard() {
  // Revenue over time (last 7 days)
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["analytics-revenue"],
    queryFn: async () => {
      const days = 7;
      const data = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const start = startOfDay(date).toISOString();
        const end = endOfDay(date).toISOString();

        const { data: orders } = await supabase
          .from("orders")
          .select("total_amount, status")
          .gte("created_at", start)
          .lte("created_at", end)
          .eq("status", "completed");

        const revenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

        data.push({
          date: format(date, "EEE"),
          fullDate: format(date, "MMM d"),
          revenue,
          orders: orders?.length || 0,
        });
      }

      return data;
    },
  });

  // Popular products
  const { data: popularProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["analytics-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("order_items")
        .select("product_name, quantity");

      const productCounts: Record<string, number> = {};
      data?.forEach((item) => {
        productCounts[item.product_name] = (productCounts[item.product_name] || 0) + item.quantity;
      });

      return Object.entries(productCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    },
  });

  // Order status distribution
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["analytics-status"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("status");

      const statusCounts: Record<string, number> = {};
      data?.forEach((order) => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      });

      return Object.entries(statusCounts).map(([status, value]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value,
      }));
    },
  });

  // Average metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["analytics-metrics"],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount, created_at, status");

      const completedOrders = orders?.filter((o) => o.status === "completed") || [];
      const avgOrderValue = completedOrders.length
        ? completedOrders.reduce((sum, o) => sum + Number(o.total_amount), 0) / completedOrders.length
        : 0;

      // Orders today
      const today = startOfDay(new Date()).toISOString();
      const todayOrders = orders?.filter((o) => o.created_at >= today).length || 0;

      // Unique customers (by counting orders with different customer names)
      const { data: uniqueCustomers } = await supabase
        .from("orders")
        .select("customer_phone")
        .not("customer_phone", "is", null);

      const uniquePhones = new Set(uniqueCustomers?.map((c) => c.customer_phone));

      return {
        avgOrderValue,
        todayOrders,
        totalCustomers: uniquePhones.size,
        completionRate: orders?.length
          ? ((completedOrders.length / orders.length) * 100).toFixed(0)
          : 0,
      };
    },
  });

  const isLoading = revenueLoading || productsLoading || statusLoading || metricsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Order Value</p>
                <p className="text-xl font-bold text-foreground">{metrics?.avgOrderValue.toFixed(0)} EGP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Today's Orders</p>
                <p className="text-xl font-bold text-foreground">{metrics?.todayOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Customers</p>
                <p className="text-xl font-bold text-foreground">{metrics?.totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Star className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
                <p className="text-xl font-bold text-foreground">{metrics?.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value.toFixed(0)} EGP`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={popularProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [value, "Orders"]}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusData?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
