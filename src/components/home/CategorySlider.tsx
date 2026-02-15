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
        <h3 className="font-display text-lg font-bold text-foreground">{t("categories")}</h3>
      </div>

      <div className="flex gap-2.5 overflow-x-auto px-5 pb-2 hide-scrollbar">
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ease-out active:scale-95 ${
            selectedCategory === null
              ? "bg-primary text-primary-foreground shadow-button hover:-translate-y-1"
              : "bg-card text-foreground shadow-card hover:-translate-y-1 hover:shadow-elevated"
          }`}
        >
          🔥 {t("allItems")}
        </button>

        {isLoading ? (
          <div className="flex gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-24 h-10 bg-card rounded-full shimmer shadow-soft" />
            ))}
          </div>
        ) : (
          categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ease-out animate-scale-in active:scale-95 ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-button hover:-translate-y-1"
                  : "bg-card text-foreground shadow-card hover:-translate-y-1 hover:shadow-elevated"
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
