import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/mr-juice-logo-new.jpg";

interface HeroSectionProps {
  onQuickOrder: () => void;
}

export const HeroSection = ({ onQuickOrder }: HeroSectionProps) => {
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
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <p className="text-white/80 text-sm font-medium">Good morning ☀️</p>
            <h2 className="text-white font-display text-xl font-bold">Welcome back!</h2>
          </div>
          <img
            src={logoImage}
            alt="MR. Juice"
            className="w-16 h-16 rounded-2xl shadow-lg object-cover bg-white hover:scale-105 hover:rotate-3 transition-transform duration-300"
          />
        </div>

        {/* Main hero content */}
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">Fresh & Natural</span>
          </div>

          <h1 className="text-4xl font-display font-bold text-white leading-tight">
            MR. Juice{" "}
            <span className="block text-white/90">Fresh Drinks</span>{" "}
            Delivered Fast
          </h1>

          <p className="text-white/80 text-base max-w-xs">
            100% natural ingredients, made fresh daily. Order now and taste the difference!
          </p>

          <div className="flex gap-3 pt-2">
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={onQuickOrder}
              className="flex-1 bg-white text-primary hover:bg-white/90 font-bold shadow-lg"
            >
              Order Now
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              className="text-white border-2 border-white/30 hover:bg-white/10 hover:text-white"
            >
              Menu
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-8 pt-6 border-t border-white/20 animate-fade-in">
          {[
            { value: "50+", label: "Fresh Drinks" },
            { value: "15min", label: "Delivery" },
            { value: "4.9", label: "Rating ⭐" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
