import { ChevronRight } from "lucide-react";
import { promotions } from "@/data/menu";

export const PromotionBanner = () => {
  const promotion = promotions[0];

  return (
    <section className="px-5 py-3">
      <div className="relative overflow-hidden rounded-3xl bg-primary p-6 shadow-button animate-scale-in">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <span className="inline-block bg-secondary text-secondary-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
              🔥 Limited Time
            </span>
            <h3 className="text-white font-display text-lg font-bold leading-tight">
              {promotion.title}
            </h3>
            <p className="text-white/70 text-xs max-w-[180px]">
              {promotion.description}
            </p>
            {promotion.code && (
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full mt-1">
                <span className="text-white/80 text-[10px]">Code:</span>
                <span className="text-secondary font-bold text-xs">{promotion.code}</span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 animate-bounce-subtle">
            <span className="text-5xl">🎁</span>
          </div>
        </div>

        <button className="flex items-center gap-1 text-white/80 text-xs font-medium mt-3 hover:translate-x-1 transition-transform">
          Claim Now <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
