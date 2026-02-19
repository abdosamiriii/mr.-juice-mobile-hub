import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Package, FolderOpen, Ruler, Plus, LogOut, ShoppingBag, BarChart3, Users, Volume2, VolumeX, MapPin } from "lucide-react";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { SizesManager } from "@/components/admin/SizesManager";
import { AddOnsManager } from "@/components/admin/AddOnsManager";
import { OrdersManager } from "@/components/admin/OrdersManager";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { AdminInvitations } from "@/components/admin/AdminInvitations";
import { DeliveryZonesManager } from "@/components/admin/DeliveryZonesManager";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import logoImage from "@/assets/mr-juice-logo-new.jpg";

const AdminContent = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { t, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState("orders");
  const [soundEnabled, setSoundEnabled] = useState(true);

  useOrderNotifications(soundEnabled);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const BackArrow = direction === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <BackArrow className="h-5 w-5" />
            </Button>
            <img src={logoImage} alt="MR. Juice" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">{t("adminDashboard")}</h1>
              <p className="text-xs text-muted-foreground">{t("manageMenuOrders")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? t("muteNotifications") : t("enableNotifications")}
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-primary" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 me-2" />
              {t("signOut")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-6">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">{t("orders")}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">{t("analytics")}</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">{t("products")}</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">{t("categoriesTab")}</span>
            </TabsTrigger>
            <TabsTrigger value="sizes" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              <span className="hidden sm:inline">{t("sizes")}</span>
            </TabsTrigger>
            <TabsTrigger value="addons" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t("addons")}</span>
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">{t("deliveryTab")}</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t("team")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders"><OrdersManager /></TabsContent>
          <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
          <TabsContent value="products"><ProductsManager /></TabsContent>
          <TabsContent value="categories"><CategoriesManager /></TabsContent>
          <TabsContent value="sizes"><SizesManager /></TabsContent>
          <TabsContent value="addons"><AddOnsManager /></TabsContent>
          <TabsContent value="delivery"><DeliveryZonesManager /></TabsContent>
          <TabsContent value="team"><AdminInvitations /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

/**
 * Admin page — wrapped in AdminGuard which verifies the server-side
 * has_role('admin') check before rendering any dashboard content.
 * Non-admins are hard-redirected; the dashboard is never rendered.
 */
const Admin = () => (
  <AdminGuard>
    <AdminContent />
  </AdminGuard>
);

export default Admin;
