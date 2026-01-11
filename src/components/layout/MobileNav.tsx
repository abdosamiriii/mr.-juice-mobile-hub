import { Home, Search, ShoppingCart, User, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => {
  const { totalItems } = useCart();
  const { t, direction } = useLanguage();

  const navItems = [
    { id: "home", icon: Home, label: t("home") },
    { id: "menu", icon: UtensilsCrossed, label: t("menu") },
    { id: "search", icon: Search, label: t("search") },
    { id: "cart", icon: ShoppingCart, label: t("cart") },
    { id: "profile", icon: User, label: t("profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className={`flex items-center justify-around py-2 px-4 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const showBadge = item.id === "cart" && totalItems > 0;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center gap-1 p-2 min-w-[60px]"
            >
              <div className="relative">
                <div
                  className={`transition-all duration-200 ${
                    isActive ? "scale-110 -translate-y-0.5" : "scale-100"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>

                {showBadge && (
                  <span className="absolute -top-1 -right-2 bg-secondary text-secondary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
