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
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav safe-bottom">
      <div className={`flex items-center justify-around py-2 px-4 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const showBadge = item.id === "cart" && totalItems > 0;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center gap-1 p-2 min-w-[60px] group"
            >
              <div className="relative">
                {/* Active background */}
                {isActive && (
                  <div className="absolute inset-0 -m-2 bg-secondary/40 rounded-2xl" />
                )}
                
                <div
                  className={`relative transition-all duration-300 ${
                    isActive 
                      ? "scale-110 -translate-y-1" 
                      : "scale-100 group-hover:scale-105"
                  }`}
                >
                  <Icon
                    className={`relative w-6 h-6 transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                </div>

                {/* Cart badge */}
                {showBadge && (
                  <span className="absolute -top-1 -right-2 bg-juice-pink text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in shadow-sm">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-medium transition-all duration-200 ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {item.label}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-secondary shadow-sm animate-scale-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
