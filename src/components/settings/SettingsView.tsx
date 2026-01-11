import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Mail,
  Lock,
  Bell,
  Globe,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

type SettingsTab = "main" | "language";

export const SettingsView = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>("main");

  const handleSignOut = async () => {
    await signOut();
    toast.success(t("signOut"));
  };

  const menuItems = [
    {
      icon: User,
      label: t("accountInformation"),
      action: () => toast.info(t("comingSoon")),
    },
    {
      icon: MapPin,
      label: t("deliveryAddresses"),
      action: () => toast.info(t("comingSoon")),
    },
    {
      icon: Mail,
      label: t("changeEmail"),
      action: () => toast.info(t("comingSoon")),
    },
    {
      icon: Lock,
      label: t("changePassword"),
      action: () => toast.info(t("comingSoon")),
    },
    {
      icon: Bell,
      label: t("notifications"),
      action: () => toast.info(t("comingSoon")),
    },
    {
      icon: Globe,
      label: t("language"),
      badge: language === "ar" ? "العربية" : "English",
      action: () => setActiveTab("language"),
    },
  ];

  // Language Selection View
  if (activeTab === "language") {
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
            <h1 className="font-display text-xl font-bold text-foreground">{t("language")}</h1>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
            <button
              onClick={() => {
                setLanguage("en");
                setActiveTab("main");
              }}
              className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border ${
                direction === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <span className="text-lg">🇬🇧</span>
              </div>
              <div className={`flex-1 ${direction === "rtl" ? "text-right" : "text-left"}`}>
                <p className="font-medium text-foreground">English</p>
              </div>
              {language === "en" && <Check className="w-5 h-5 text-primary" />}
            </button>

            <button
              onClick={() => {
                setLanguage("ar");
                setActiveTab("main");
              }}
              className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                direction === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <span className="text-lg">🇪🇬</span>
              </div>
              <div className={`flex-1 ${direction === "rtl" ? "text-right" : "text-left"}`}>
                <p className="font-medium text-foreground">العربية</p>
              </div>
              {language === "ar" && <Check className="w-5 h-5 text-primary" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="sticky top-0 bg-background z-10 px-5 py-4 border-b border-border">
        <h1 className="font-display text-xl font-bold text-foreground">{t("settings")}</h1>
      </div>

      <div className="p-5">
        {/* Settings Items */}
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

        {/* Logout Button */}
        {user && (
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 mt-6 py-4 text-destructive font-medium"
          >
            <LogOut className="w-5 h-5" />
            {t("logout")}
          </button>
        )}
      </div>
    </div>
  );
};
