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
    <section className="py-5">
      <div className="px-5 mb-3">
        <h3 className="font-display text-base font-bold text-foreground">{t("categories")}</h3>
      </div>

      <div className="flex gap-2.5 overflow-x-auto px-5 pb-2 hide-scrollbar">
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium text-xs transition-all duration-300 ease-out active:scale-95 ${
            selectedCategory === null
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/35"
              : "glass-card text-foreground hover:-translate-y-0.5 hover:shadow-md hover:bg-white/20"
          }`}
        >
          🔥 {t("allItems")}
        </button>

        {isLoading ? (
          <div className="flex gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-8 glass-card rounded-xl shimmer" />
            ))}
          </div>
        ) : (
          categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium text-xs transition-all duration-300 ease-out animate-scale-in active:scale-95 whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/35"
                  : "glass-card text-foreground hover:-translate-y-0.5 hover:shadow-md hover:bg-white/20"
              }`}
            >
              <span className="inline-block transition-transform duration-300">{category.icon}</span> {category.name}
            </button>
          ))
        )}
      </div>
    </section>
  );
};
