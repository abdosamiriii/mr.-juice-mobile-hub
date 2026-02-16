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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className={`flex items-center justify-around py-2 px-2 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const showBadge = item.id === "cart" && totalItems > 0;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center gap-0.5 p-2 min-w-[56px]"
            >
              <div className="relative">
                {/* Active pill background */}
                {isActive && (
                  <div className="absolute -inset-2.5 bg-secondary/50 rounded-2xl animate-scale-in" />
                )}
                
                <Icon
                  className={`relative w-5.5 h-5.5 transition-all duration-200 ${
                    isActive ? "text-primary scale-110" : "text-muted-foreground"
                  }`}
                  style={{ width: 22, height: 22 }}
                />

                {/* Cart badge */}
                {showBadge && (
                  <span className="absolute -top-1.5 -end-2.5 bg-juice-pink text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-scale-in shadow-sm"
                    style={{ width: 18, height: 18, fontSize: 10 }}
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-medium mt-0.5 ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
