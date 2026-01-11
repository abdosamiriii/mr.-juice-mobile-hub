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
    <section className="relative overflow-hidden bg-hero-gradient pt-safe">
      {/* Decorative patterns - African inspired */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-20 h-20 border-4 border-white rounded-full" />
        <div className="absolute top-12 right-8 w-12 h-12 border-2 border-white rotate-45" />
        <div className="absolute bottom-20 left-10 w-16 h-16 border-3 border-white rounded-full" />
      </div>
      
      {/* Decorative circles */}
      <div className="absolute top-10 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

      <div className="relative px-5 pt-8 pb-12">
        {/* Logo and greeting */}
        <div className={`flex items-center justify-between mb-8 animate-fade-in ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
          <div className={direction === "rtl" ? "text-right" : ""}>
            <p className="text-white/80 text-sm font-medium">{greeting}</p>
            <h2 className="text-white font-display text-xl font-bold">{t("welcomeBack")}</h2>
          </div>
          <img
            src={logoImage}
            alt="MR. Juice"
            className="w-16 h-16 rounded-2xl shadow-lg object-cover bg-white hover:scale-105 hover:rotate-3 transition-transform duration-300"
          />
        </div>

        {/* Main hero content */}
        <div className={`space-y-4 animate-slide-up ${direction === "rtl" ? "text-right" : ""}`}>
          <div className={`flex items-center gap-2 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">{t("freshNatural")}</span>
          </div>

          <h1 className="text-4xl font-display font-bold text-white leading-tight">
            {t("mrJuice")}{" "}
            <span className="block text-white/90">{t("freshDrinks")}</span>{" "}
            {t("deliveredFast")}
          </h1>

          <p className="text-white/80 text-base max-w-xs">
            {t("heroDescription")}
          </p>

          <div className={`flex gap-3 pt-2 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={onQuickOrder}
              className={`flex-1 bg-white text-primary hover:bg-white/90 font-bold shadow-lg ${direction === "rtl" ? "flex-row-reverse" : ""}`}
            >
              {t("orderNow")}
              <ArrowRight className={`w-5 h-5 ${direction === "rtl" ? "mr-1 rotate-180" : "ml-1"}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              onClick={onMenuClick}
              className="text-white border-2 border-white/30 hover:bg-white/10 hover:text-white"
            >
              {t("menu")}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className={`flex gap-6 mt-8 pt-6 border-t border-white/20 animate-fade-in ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
          {[
            { value: "50+", label: t("freshDrinksCount") },
            { value: "15min", label: t("delivery") },
            { value: "4.9", label: t("rating") + " ⭐" },
          ].map((stat) => (
            <div key={stat.label} className={direction === "rtl" ? "text-right" : ""}>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
