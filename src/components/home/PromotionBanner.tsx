import { ChevronRight } from "lucide-react";
import { promotions } from "@/data/menu";

export const PromotionBanner = () => {
  const promotion = promotions[0];

  return (
    <section className="px-5 py-4">
      <div className="relative overflow-hidden rounded-3xl bg-primary p-6 shadow-button animate-scale-in">
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2">
            <span className="inline-block bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              🔥 Limited Time
            </span>
            <h3 className="text-white font-display text-xl font-bold">
              {promotion.title}
            </h3>
            <p className="text-white/80 text-sm max-w-[180px]">
              {promotion.description}
            </p>
            {promotion.code && (
              <div className="inline-flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-xl mt-2">
                <span className="text-white text-xs">Use code:</span>
                <span className="text-secondary font-bold text-sm">{promotion.code}</span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 animate-bounce-subtle">
            <span className="text-6xl">🎁</span>
          </div>
        </div>

        <button className="flex items-center gap-1 text-white/90 text-sm font-medium mt-4 hover:translate-x-1 transition-transform duration-200">
          Claim Now <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
