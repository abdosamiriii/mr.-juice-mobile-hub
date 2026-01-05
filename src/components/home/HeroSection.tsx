import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/mr-juice-logo.jpg";

interface HeroSectionProps {
  onQuickOrder: () => void;
}

export const HeroSection = ({ onQuickOrder }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-hero-gradient pt-safe">
      {/* Decorative circles */}
      <div className="absolute top-10 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />

      <div className="relative px-5 pt-8 pb-12">
        {/* Logo and greeting */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <p className="text-foreground/70 text-sm font-medium">Good morning ☀️</p>
            <h2 className="text-foreground font-display text-xl font-bold">Welcome back!</h2>
          </div>
          <img
            src={logoImage}
            alt="MR. Juice"
            className="w-14 h-14 rounded-2xl shadow-card object-cover hover:scale-105 hover:rotate-3 transition-transform duration-300"
          />
        </div>

        {/* Main hero content */}
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Fresh & Natural</span>
          </div>

          <h1 className="text-4xl font-display font-bold text-foreground leading-tight">
            Fresh Juice,{" "}
            <span className="text-primary">Delivered</span>{" "}
            to Your Door
          </h1>

          <p className="text-foreground/70 text-base max-w-xs">
            100% natural ingredients, made fresh daily. Order now and taste the difference!
          </p>

          <div className="flex gap-3 pt-2">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={onQuickOrder}
              className="flex-1"
            >
              Order Now
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Button variant="glass" size="lg">
              Menu
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-8 pt-6 border-t border-foreground/10 animate-fade-in">
          {[
            { value: "20+", label: "Fresh Drinks" },
            { value: "15min", label: "Delivery" },
            { value: "4.9", label: "Rating ⭐" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-foreground/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
