// Category image mapping - import all product images
import smoothieImg from "@/assets/products/smoothie.jpg";
import freshJuiceImg from "@/assets/products/fresh-juice.jpg";
import milkshakeImg from "@/assets/products/milkshake.jpg";
import gelatoImg from "@/assets/products/gelato.jpg";
import wafflesImg from "@/assets/products/waffles.jpg";
import belilaImg from "@/assets/products/belila.jpg";
import omAliImg from "@/assets/products/om-ali.jpg";
import mojitoImg from "@/assets/products/mojito.jpg";
import greekYogurtImg from "@/assets/products/greek-yogurt.jpg";
import fruitSaladImg from "@/assets/products/fruit-salad.jpg";
import sundaeImg from "@/assets/products/sundae.jpg";
import hotChocolateImg from "@/assets/products/hot-chocolate.jpg";
import pancakesImg from "@/assets/products/pancakes.jpg";
import familyJuiceImg from "@/assets/products/family-juice.jpg";

// Map category names/ids to images
const categoryImageMap: Record<string, string> = {
  // By category name (case-insensitive matching)
  smoothie: smoothieImg,
  "fresh juices": freshJuiceImg,
  "fresh juice": freshJuiceImg,
  milkshake: milkshakeImg,
  gelato: gelatoImg,
  waffles: wafflesImg,
  waffle: wafflesImg,
  belila: belilaImg,
  "om ali": omAliImg,
  mojito: mojitoImg,
  "greek yogurt": greekYogurtImg,
  "fruit salad": fruitSaladImg,
  sundae: sundaeImg,
  hot: hotChocolateImg,
  pancakes: pancakesImg,
  "family juices": familyJuiceImg,
  "family juice": familyJuiceImg,
};

// Get image for a category (by name or partial match)
export const getCategoryImage = (categoryId: string, categoryName?: string): string => {
  const searchTerms = [
    categoryId?.toLowerCase(),
    categoryName?.toLowerCase(),
  ].filter(Boolean);

  for (const term of searchTerms) {
    // Direct match
    if (term && categoryImageMap[term]) {
      return categoryImageMap[term];
    }
    
    // Partial match
    for (const [key, value] of Object.entries(categoryImageMap)) {
      if (term && (term.includes(key) || key.includes(term))) {
        return value;
      }
    }
  }

  // Default to smoothie if no match
  return smoothieImg;
};

// Category emoji mapping (fallback)
export const getCategoryEmoji = (categoryId: string): string => {
  const emojis: Record<string, string> = {
    smoothie: "🥤",
    "fresh juices": "🍊",
    "fresh juice": "🍊",
    milkshake: "🥛",
    gelato: "🍨",
    waffles: "🧇",
    waffle: "🧇",
    belila: "🍮",
    "om ali": "🥛",
    mojito: "🍹",
    "greek yogurt": "🥣",
    "fruit salad": "🍓",
    sundae: "🍨",
    hot: "☕",
    pancakes: "🥞",
    "family juices": "🍊",
  };
  
  const searchTerm = categoryId.toLowerCase();
  if (emojis[searchTerm]) return emojis[searchTerm];
  
  for (const [key, value] of Object.entries(emojis)) {
    if (searchTerm.includes(key) || key.includes(searchTerm)) {
      return value;
    }
  }
  
  return "🍹";
};
