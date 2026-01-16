export interface Size {
  id: string;
  name: string;
  priceModifier: number;
  ml: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  largePrice?: number;
  image: string;
  categoryId: string;
  sizes: Size[];
  addOns: AddOn[];
  ingredients: string[];
  calories: number;
  isPopular?: boolean;
  isSeasonal?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: Size;
  selectedAddOns: AddOn[];
  excludedIngredients: string[];
  quantity: number;
  specialInstructions?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: number;
  code?: string;
  validUntil: string;
}
