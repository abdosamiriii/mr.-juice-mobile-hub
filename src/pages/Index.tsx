import { useState } from "react";
import { CartProvider } from "@/context/CartContext";
import { MobileNav } from "@/components/layout/MobileNav";
import { HeroSection } from "@/components/home/HeroSection";
import { PromotionBanner } from "@/components/home/PromotionBanner";
import { CategorySlider } from "@/components/home/CategorySlider";
import { PopularProducts } from "@/components/home/PopularProducts";
import { ProductDetailSheet } from "@/components/product/ProductDetailSheet";
import { CartView } from "@/components/cart/CartView";
import { SearchView } from "@/components/search/SearchView";
import { ProfileView } from "@/components/profile/ProfileView";
import { CheckoutSheet } from "@/components/checkout/CheckoutSheet";
import { OrderTracker } from "@/components/orders/OrderTracker";
import { Product } from "@/types/menu";

const IndexContent = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | undefined>(undefined);
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleSelectProduct = (product: Product, categoryName?: string) => {
    setSelectedProduct(product);
    setSelectedCategoryName(categoryName);
    setIsProductSheetOpen(true);
  };

  const handleQuickOrder = () => {
    setActiveTab("menu");
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setActiveTab("home");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <main className="min-h-screen bg-background">
            <HeroSection onQuickOrder={handleQuickOrder} onMenuClick={() => setActiveTab("menu")} />
            <OrderTracker />
            <PromotionBanner />
            <CategorySlider
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <PopularProducts
              categoryFilter={selectedCategory}
              onSelectProduct={handleSelectProduct}
            />
          </main>
        );
      case "menu":
        return (
          <main className="min-h-screen bg-background pt-6">
            <div className="px-5 mb-4">
              <h1 className="font-display text-2xl font-bold text-foreground">Full Menu</h1>
              <p className="text-muted-foreground text-sm">Explore all our fresh drinks</p>
            </div>
            <CategorySlider
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <PopularProducts
              categoryFilter={selectedCategory}
              onSelectProduct={handleSelectProduct}
            />
          </main>
        );
      case "search":
        return (
          <main className="min-h-screen bg-background">
            <SearchView onSelectProduct={handleSelectProduct} />
          </main>
        );
      case "cart":
        return (
          <main className="min-h-screen bg-background">
            <CartView onCheckout={handleCheckout} onBrowseMenu={() => setActiveTab("menu")} />
          </main>
        );
      case "profile":
        return (
          <main className="min-h-screen bg-background">
            <ProfileView />
          </main>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {renderTabContent()}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      <ProductDetailSheet
        product={selectedProduct}
        isOpen={isProductSheetOpen}
        onClose={() => setIsProductSheetOpen(false)}
        categoryName={selectedCategoryName}
      />
      <CheckoutSheet
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
};

const Index = () => {
  return (
    <CartProvider>
      <IndexContent />
    </CartProvider>
  );
};

export default Index;
