import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, CreditCard, History, LogOut, ChevronRight, Shield, ArrowLeft, Settings, Calendar, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { OrderHistory } from "@/components/orders/OrderHistory";
import { SettingsView } from "@/components/settings/SettingsView";
import { LoyaltyCalendar } from "@/components/profile/LoyaltyCalendar";
import { AvatarSelector } from "@/components/profile/AvatarSelector";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useProfile } from "@/hooks/useProfile";
import logoImage from "@/assets/mr-juice-logo-new.jpg";

type ProfileTab = "main" | "orders" | "settings" | "loyalty" | "avatar";

export const ProfileView = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut, isLoading } = useAuth();
  const { t, direction } = useLanguage();
  const { avatarId } = useProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>("main");

  const menuItems = [
    { icon: History, label: t("orderHistory"), action: () => setActiveTab("orders") },
    { icon: Calendar, label: "Loyalty Calendar", action: () => setActiveTab("loyalty") },
    { icon: MapPin, label: t("savedAddresses"), action: undefined },
    { icon: CreditCard, label: t("paymentMethods"), action: undefined },
    { icon: Settings, label: t("settings"), action: () => setActiveTab("settings") },
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

  // Sub-screens with back button
  const renderSubScreen = (title: string, content: React.ReactNode) => (
    <div className="pb-24">
      <div className="sticky top-0 bg-background z-10 px-5 py-4 border-b border-border">
        <div className={`flex items-center gap-3 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
          <button 
            onClick={() => setActiveTab("main")}
            className="w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center"
          >
            <ArrowLeft className={`w-5 h-5 ${direction === "rtl" ? "rotate-180" : ""}`} />
          </button>
          <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
        </div>
      </div>
      {content}
    </div>
  );

  if (activeTab === "orders") return renderSubScreen(t("orderHistory"), <OrderHistory />);
  if (activeTab === "settings") return renderSubScreen(t("settings"), <SettingsView />);
  if (activeTab === "loyalty") return renderSubScreen("Loyalty Calendar", <div className="px-5 pt-4"><LoyaltyCalendar /></div>);

  const userName = user ? (user.user_metadata?.full_name || user.email?.split("@")[0]) : t("guestUser");

  return (
    <div className="pb-24" dir={direction}>
      {/* Purple header */}
      <div className="bg-primary rounded-b-[2.5rem] px-5 pt-8 pb-10 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-foreground/10 rounded-full" />
        <div className="absolute top-4 right-16 w-8 h-8 bg-primary-foreground/15 rounded-full" />

        <div className="flex items-center justify-between mb-6">
          <button className="w-10 h-10 rounded-full bg-card/80 flex items-center justify-center">
            <ArrowLeft className={`w-5 h-5 ${direction === "rtl" ? "rotate-180" : ""}`} />
          </button>
          <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm">
            <img src={logoImage} alt="MR. Juice" className="w-7 h-7 rounded-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center shadow-elevated mb-3 ring-4 ring-primary-foreground/20">
            <User className="w-12 h-12 text-primary" />
          </div>

          <div className="flex items-center gap-4 -mt-2 mb-2">
            <span className="bg-primary-foreground/20 text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
              450 PT
            </span>
          </div>

          <h2 className="font-display text-xl font-bold text-primary-foreground">{userName}</h2>
          {user && <p className="text-sm text-primary-foreground/60 mt-0.5">{user.email}</p>}
          
          {isAdmin && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-card px-3 py-1 rounded-full mt-2">
              <Shield className="w-3 h-3" />
              {t("admin")}
            </span>
          )}
        </div>
      </div>

      {/* Tab pills */}
      <div className="flex justify-center gap-2 -mt-5 px-5 relative z-10">
        {[
          { id: "orders" as ProfileTab, label: t("orderHistory") },
          { id: "loyalty" as ProfileTab, label: "Loyalty" },
          { id: "settings" as ProfileTab, label: t("settings") },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="bg-primary text-primary-foreground text-xs font-bold px-5 py-2.5 rounded-full shadow-button transition-all hover:opacity-90 active:scale-95"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-5 mt-6">
        {isAdmin && (
          <Button 
            onClick={() => navigate("/admin")} 
            className="w-full mb-4 rounded-full"
            variant="default"
          >
            <Shield className="w-4 h-4 me-2" />
            {t("openAdminDashboard")}
          </Button>
        )}

        {!user && (
          <div className="bg-card rounded-3xl p-5 mb-4 shadow-card">
            <div className="flex items-start gap-4">
              <img src={logoImage} alt="MR. Juice" className="w-12 h-12 rounded-full object-cover shadow-card" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{t("joinMrJuice")}</h3>
                <p className="text-sm text-muted-foreground mb-3">{t("joinDescription")}</p>
                <Button variant="default" size="sm" className="rounded-full" onClick={() => navigate("/auth")}>
                  {t("signInSignUp")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="bg-card rounded-3xl shadow-card overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-start">
                <p className="font-medium text-foreground">{item.label}</p>
              </div>
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
    </div>
  );
};
