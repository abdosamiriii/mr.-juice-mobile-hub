import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, CreditCard, History, LogOut, ChevronRight, Shield, ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { OrderHistory } from "@/components/orders/OrderHistory";
import { SettingsView } from "@/components/settings/SettingsView";
import logoImage from "@/assets/mr-juice-logo-new.jpg";

type ProfileTab = "main" | "orders" | "settings";

export const ProfileView = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut, isLoading } = useAuth();
  const { t, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState<ProfileTab>("main");

  const menuItems = [
    { icon: History, label: t("orderHistory"), badge: null, action: () => setActiveTab("orders") },
    { icon: MapPin, label: t("savedAddresses"), badge: null, action: undefined },
    { icon: CreditCard, label: t("paymentMethods"), badge: null, action: undefined },
    { icon: Settings, label: t("settings"), badge: null, action: () => setActiveTab("settings") },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-primary">{t("loading")}</div>
      </div>
    );
  }

  if (activeTab === "orders") {
    return (
      <div className="pb-24">
        <div className="sticky top-0 bg-background z-10 px-5 py-4 border-b border-border">
          <div className={`flex items-center gap-3 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <button 
              onClick={() => setActiveTab("main")}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            >
              <ArrowLeft className={`w-5 h-5 ${direction === "rtl" ? "rotate-180" : ""}`} />
            </button>
            <h1 className="font-display text-xl font-bold text-foreground">{t("orderHistory")}</h1>
          </div>
        </div>
        <OrderHistory />
      </div>
    );
  }

  if (activeTab === "settings") {
    return (
      <div className="pb-24">
        <div className="sticky top-0 bg-background z-10 px-5 py-4 border-b border-border">
          <div className={`flex items-center gap-3 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <button 
              onClick={() => setActiveTab("main")}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            >
              <ArrowLeft className={`w-5 h-5 ${direction === "rtl" ? "rotate-180" : ""}`} />
            </button>
            <h1 className="font-display text-xl font-bold text-foreground">{t("settings")}</h1>
          </div>
        </div>
        <SettingsView />
      </div>
    );
  }

  return (
    <div className="px-5 py-6 pb-24">
      {/* Profile Header */}
      <div className={`flex items-center gap-4 mb-8 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
          <User className="w-10 h-10 text-white" />
        </div>
        <div className={`flex-1 ${direction === "rtl" ? "text-right" : ""}`}>
          <h2 className="font-display text-xl font-bold text-foreground">
            {user ? (user.user_metadata?.full_name || user.email?.split("@")[0]) : t("guestUser")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {user ? user.email : t("signInForRewards")}
          </p>
          {isAdmin && (
            <span className={`inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
              <Shield className="w-3 h-3" />
              {t("admin")}
            </span>
          )}
        </div>
      </div>

      {isAdmin && (
        <Button 
          onClick={() => navigate("/admin")} 
          className={`w-full mb-6 ${direction === "rtl" ? "flex-row-reverse" : ""}`}
          variant="default"
        >
          <Shield className={`w-4 h-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
          {t("openAdminDashboard")}
        </Button>
      )}

      {!user && (
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-5 mb-6 border border-primary/20">
          <div className={`flex items-start gap-4 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <img src={logoImage} alt="MR. Juice" className="w-12 h-12 rounded-xl object-cover" />
            <div className={`flex-1 ${direction === "rtl" ? "text-right" : ""}`}>
              <h3 className="font-semibold text-foreground mb-1">{t("joinMrJuice")}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t("joinDescription")}</p>
              <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
                {t("signInSignUp")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            onClick={item.action}
            className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
              index !== menuItems.length - 1 ? "border-b border-border" : ""
            } ${direction === "rtl" ? "flex-row-reverse" : ""}`}
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <item.icon className="w-5 h-5 text-foreground" />
            </div>
            <div className={`flex-1 ${direction === "rtl" ? "text-right" : "text-left"}`}>
              <p className="font-medium text-foreground">{item.label}</p>
            </div>
            {item.badge && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
            <ChevronRight className={`w-5 h-5 text-muted-foreground ${direction === "rtl" ? "rotate-180" : ""}`} />
          </button>
        ))}
      </div>

      {user && (
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 mt-6 py-4 text-destructive font-medium"
        >
          <LogOut className="w-5 h-5" />
          {t("signOut")}
        </button>
      )}

      <div className="text-center mt-8">
        <p className="text-xs text-muted-foreground">MR. Juice v1.0.0</p>
        <p className="text-xs text-muted-foreground mt-1">{t("madeWithLove")}</p>
      </div>
    </div>
  );
};
