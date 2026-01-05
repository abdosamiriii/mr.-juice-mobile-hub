import { categories } from "@/data/menu";

interface CategorySliderProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategorySlider = ({ selectedCategory, onSelectCategory }: CategorySliderProps) => {
  return (
    <section className="py-6">
      <div className="px-5 mb-4">
        <h3 className="font-display text-lg font-bold text-foreground">Categories</h3>
      </div>

      <div className="flex gap-3 overflow-x-auto px-5 pb-2 hide-scrollbar">
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex-shrink-0 px-5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            selectedCategory === null
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-card text-foreground shadow-soft border border-border"
          }`}
        >
          🔥 All
        </button>

        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            style={{ animationDelay: `${index * 50}ms` }}
            className={`flex-shrink-0 px-5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-scale-in ${
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-card text-foreground shadow-soft border border-border"
            }`}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>
    </section>
  );
};
