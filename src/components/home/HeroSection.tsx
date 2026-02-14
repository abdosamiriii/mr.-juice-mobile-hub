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
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />

      <div className="relative px-5 pt-8 pb-12" dir={direction}>
        {/* Logo and greeting */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="bg-white/15 rounded-2xl px-4 py-3">
            <p className="text-white/90 text-sm font-medium">{greeting}</p>
            <h2 className="text-white font-display text-xl font-bold">{t("welcomeBack")}</h2>
          </div>
          <div className="relative group cursor-pointer animate-logo-entrance">
            <div className="absolute inset-0 bg-white/20 rounded-xl blur-lg group-hover:bg-white/40 transition-all duration-500 ease-out group-hover:scale-110" />
            <img
              src={logoImage}
              alt="MR. Juice"
              className="relative w-12 h-12 rounded-xl shadow-lg object-cover bg-white/90 ring-1 ring-white/30 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl group-active:scale-95"
            />
          </div>
        </div>

        {/* Main hero content */}
        <div className="space-y-5 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 transition-all duration-300 ease-out hover:bg-white/25 hover:scale-105 cursor-default">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
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

          <div className="flex gap-3 pt-3">
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={onQuickOrder}
              className="flex-1 bg-white/90 text-primary hover:bg-white font-bold shadow-lg border-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-95 group"
            >
              {t("orderNow")}
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${direction === "rtl" ? "me-1 rotate-180 group-hover:-translate-x-1" : "ms-1"}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              onClick={onMenuClick}
              className="bg-white/15 text-white border-white/20 hover:bg-white/25 hover:text-white transition-all duration-300 ease-out hover:-translate-y-1 active:scale-95"
            >
              {t("menu")}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white/15 rounded-2xl p-4 mt-8 animate-fade-in">
          <div className="flex">
            {[
              { value: "50+", label: t("freshDrinksCount"), emoji: "🍹" },
              { value: "15min", label: t("delivery"), emoji: "🚀" },
              { value: "4.9", label: t("rating"), emoji: "⭐" },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className={`flex-1 text-center opacity-0 animate-slide-up ${
                  index !== 2 ? (direction === "rtl" ? "border-l border-white/20" : "border-r border-white/20") : ""
                } group/stat cursor-default`}
                style={{ animationDelay: `${0.6 + index * 0.15}s`, animationFillMode: 'forwards' }}
              >
                <p className="text-xl font-bold text-white transition-transform duration-300 group-hover/stat:scale-110">{stat.value}</p>
                <p className="text-xs text-white/75">
                  {stat.label}{" "}
                  <span className="inline-block transition-transform duration-300 group-hover/stat:scale-125">{stat.emoji}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
