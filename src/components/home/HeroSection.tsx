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
    <section className="relative overflow-hidden bg-secondary pt-safe">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full" />

      <div className="relative px-5 pt-8 pb-10" dir={direction}>
        {/* Logo and greeting */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <p className="text-foreground/70 text-sm font-medium">{greeting}</p>
            <h2 className="text-foreground font-display text-xl font-bold">{t("welcomeBack")}</h2>
          </div>
          <div className="relative group cursor-pointer animate-logo-entrance">
            <img
              src={logoImage}
              alt="MR. Juice"
              className="relative w-14 h-14 rounded-2xl shadow-elevated object-cover bg-white ring-2 ring-white transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-active:scale-95"
            />
          </div>
        </div>

        {/* Main hero content */}
        <div className="space-y-4 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary/15 rounded-full px-4 py-2 transition-all duration-300 ease-out hover:bg-primary/25 hover:scale-105 cursor-default">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t("freshNatural")}</span>
          </div>

          <h1 className="text-4xl font-display font-bold text-foreground leading-tight">
            {t("mrJuice")}{" "}
            <span className="block text-primary">{t("freshDrinks")}</span>{" "}
            {t("deliveredFast")}
          </h1>

          <p className="text-foreground/65 text-base max-w-xs leading-relaxed">
            {t("heroDescription")}
          </p>

          <div className="flex gap-3 pt-2">
            <Button 
              size="lg" 
              onClick={onQuickOrder}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-button border-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-95 group rounded-2xl"
            >
              {t("orderNow")}
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${direction === "rtl" ? "me-1 rotate-180 group-hover:-translate-x-1" : "ms-1"}`} />
            </Button>
            <Button 
              size="lg"
              onClick={onMenuClick}
              className="bg-foreground/10 text-foreground border-0 hover:bg-foreground/15 hover:text-foreground transition-all duration-300 ease-out hover:-translate-y-1 active:scale-95 rounded-2xl"
            >
              {t("menu")}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 mt-6 shadow-card animate-fade-in">
          <div className="flex">
            {[
              { value: "50+", label: t("freshDrinksCount"), emoji: "🍹" },
              { value: "15min", label: t("delivery"), emoji: "🚀" },
              { value: "4.9", label: t("rating"), emoji: "⭐" },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className={`flex-1 text-center opacity-0 animate-slide-up ${
                  index !== 2 ? (direction === "rtl" ? "border-l border-border" : "border-r border-border") : ""
                } group/stat cursor-default`}
                style={{ animationDelay: `${0.6 + index * 0.15}s`, animationFillMode: 'forwards' }}
              >
                <p className="text-xl font-bold text-primary transition-transform duration-300 group-hover/stat:scale-110">{stat.value}</p>
                <p className="text-xs text-muted-foreground">
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
