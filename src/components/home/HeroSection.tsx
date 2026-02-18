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
    <section className="relative overflow-hidden bg-primary" dir={direction}>
      {/* Decorative elements */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary-foreground/10 rounded-full" />
      <div className="absolute top-20 -left-8 w-20 h-20 bg-primary-foreground/10 rounded-full" />
      <div className="absolute bottom-8 right-8 w-12 h-12 bg-primary-foreground/15 rounded-full" />

      <div className="relative px-5 pt-10 pb-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <p className="text-primary-foreground/60 text-sm font-medium">{greeting}</p>
            <h2 className="text-primary-foreground font-display text-xl font-bold">{t("welcomeBack")}</h2>
          </div>
          <div className="relative animate-logo-entrance">
            <div className="w-16 h-16 rounded-full bg-card shadow-elevated flex items-center justify-center ring-4 ring-card">
              <img src={logoImage} alt="MR. Juice" className="w-12 h-12 rounded-full object-cover" />
            </div>
          </div>
        </div>

        <div className="space-y-4 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/15 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-semibold text-primary-foreground">{t("freshNatural")}</span>
          </div>

          <h1 className="text-3xl font-display font-bold text-primary-foreground leading-tight">
            {t("mrJuice")}{" "}
            <span className="text-primary-foreground/80">{t("freshDrinks")}</span>
          </h1>

          <p className="text-primary-foreground/60 text-sm max-w-xs leading-relaxed">
            {t("heroDescription")}
          </p>

          <div className="flex gap-3 pt-2">
            <Button 
              size="lg" 
              onClick={onQuickOrder}
              className="flex-1 group rounded-full h-14 bg-card text-primary hover:bg-card/90"
            >
              {t("orderNow")}
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${direction === "rtl" ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={onMenuClick}
              className="rounded-full h-14 border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              {t("menu")}
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-card rounded-3xl p-5 mt-8 shadow-elevated animate-fade-in">
          <div className="flex">
            {[
              { value: "50+", label: t("freshDrinksCount"), emoji: "🍹" },
              { value: "15min", label: t("delivery"), emoji: "🚀" },
              { value: "4.9", label: t("rating"), emoji: "⭐" },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className={`flex-1 text-center ${
                  index !== 2 ? (direction === "rtl" ? "border-l border-border" : "border-r border-border") : ""
                }`}
              >
                <p className="text-lg font-bold text-primary">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {stat.emoji} {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
