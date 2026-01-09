import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem, Product, Size, AddOn } from "@/types/menu";

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: Product,
    size: Size,
    addOns: AddOn[],
    excludedIngredients: string[],
    quantity: number,
    specialInstructions?: string
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (
      product: Product,
      size: Size,
      addOns: AddOn[],
      excludedIngredients: string[],
      quantity: number,
      specialInstructions?: string
    ) => {
      const newItem: CartItem = {
        id: `${product.id}-${size.id}-${Date.now()}`,
        product,
        selectedSize: size,
        selectedAddOns: addOns,
        excludedIngredients,
        quantity,
        specialInstructions,
      };
      setItems((prev) => [...prev, newItem]);
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const itemPrice =
      item.product.basePrice +
      item.selectedSize.priceModifier +
      item.selectedAddOns.reduce((a, addon) => a + addon.price, 0);
    return sum + itemPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
