import { useCategories } from "@/hooks/useProducts";
import { useLanguage } from "@/context/LanguageContext";

interface CategorySliderProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategorySlider = ({ selectedCategory, onSelectCategory }: CategorySliderProps) => {
  const { data: categories = [], isLoading } = useCategories();
  const { t } = useLanguage();

  return (
    <section className="py-6">
      <div className="px-5 mb-4">
        <h3 className="font-display text-lg font-bold text-foreground">{t("categories")}</h3>
      </div>

      <div className="flex gap-3 overflow-x-auto px-5 pb-2 hide-scrollbar">
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex-shrink-0 px-5 py-3 rounded-2xl font-medium text-sm transition-all duration-300 ease-out active:scale-95 ${
            selectedCategory === null
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/40"
              : "glass-card text-foreground hover:-translate-y-1 hover:shadow-lg hover:bg-white/20"
          }`}
        >
          🔥 {t("allItems")}
        </button>

        {isLoading ? (
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-24 h-10 glass-card rounded-2xl shimmer" />
            ))}
          </div>
        ) : (
          categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl font-medium text-sm transition-all duration-300 ease-out animate-scale-in active:scale-95 ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/40"
                  : "glass-card text-foreground hover:-translate-y-1 hover:shadow-lg hover:bg-white/20"
              }`}
            >
              <span className="inline-block transition-transform duration-300 group-hover:scale-110">{category.icon}</span> {category.name}
            </button>
          ))
        )}
      </div>
    </section>
  );
};
