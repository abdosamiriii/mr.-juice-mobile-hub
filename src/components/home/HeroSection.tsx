import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/mr-juice-logo-new.jpg";
import { useLanguage, useGreeting } from "@/context/LanguageContext";

interface HeroSectionProps {
  onQuickOrder: () => void;
  onMenuClick?: () => void;
}

export const HeroSection = ({ onQuickOrder, onMenuClick }: HeroSectionProps) => {
  const { t, direction } = useLanguage();
  const greeting = useGreeting();

  return (
    <section className="relative overflow-hidden bg-liquid-gradient pt-safe">
      {/* Animated mesh background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
      
      {/* Decorative floating orbs - iOS 26 style */}
      <div className="absolute top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

      {/* Glass highlight overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20" />

      <div className="relative px-5 pt-8 pb-12">
        {/* Logo and greeting with glass card */}
        <div className={`flex items-center justify-between mb-8 animate-fade-in ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
          <div className={`glass-card rounded-2xl px-4 py-3 ${direction === "rtl" ? "text-right" : ""}`}>
            <p className="text-white/90 text-sm font-medium">{greeting}</p>
            <h2 className="text-white font-display text-xl font-bold">{t("welcomeBack")}</h2>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:bg-white/30 transition-all duration-300" />
            <img
              src={logoImage}
              alt="MR. Juice"
              className="relative w-18 h-18 rounded-2xl shadow-xl object-cover bg-white/90 ring-2 ring-white/30 hover:scale-105 hover:rotate-3 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Main hero content */}
        <div className={`space-y-5 animate-slide-up ${direction === "rtl" ? "text-right" : ""}`}>
          <div className={`inline-flex items-center gap-2 glass-button rounded-full px-4 py-2 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">{t("freshNatural")}</span>
          </div>

          <h1 className="text-4xl font-display font-bold text-white leading-tight drop-shadow-lg">
            {t("mrJuice")}{" "}
            <span className="block text-white/95">{t("freshDrinks")}</span>{" "}
            {t("deliveredFast")}
          </h1>

          <p className="text-white/85 text-base max-w-xs leading-relaxed">
            {t("heroDescription")}
          </p>

          <div className={`flex gap-3 pt-3 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={onQuickOrder}
              className={`flex-1 glass-card bg-white/90 text-primary hover:bg-white font-bold shadow-xl border-0 ${direction === "rtl" ? "flex-row-reverse" : ""}`}
            >
              {t("orderNow")}
              <ArrowRight className={`w-5 h-5 ${direction === "rtl" ? "mr-1 rotate-180" : "ml-1"}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              onClick={onMenuClick}
              className="glass-button text-white border-white/20 hover:bg-white/20 hover:text-white"
            >
              {t("menu")}
            </Button>
          </div>
        </div>

        {/* Stats with glass effect */}
        <div className={`glass-card rounded-2xl p-4 mt-8 animate-fade-in ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
          <div className={`flex gap-6 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            {[
              { value: "50+", label: t("freshDrinksCount") },
              { value: "15min", label: t("delivery") },
              { value: "4.9", label: t("rating") + " ⭐" },
            ].map((stat, index) => (
              <div key={stat.label} className={`flex-1 ${index !== 2 ? "border-r border-white/20" : ""} ${direction === "rtl" ? "text-right" : ""}`}>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/75">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
