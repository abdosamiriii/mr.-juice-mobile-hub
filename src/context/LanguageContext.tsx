import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { en: "Home", ar: "الرئيسية" },
  menu: { en: "Menu", ar: "القائمة" },
  search: { en: "Search", ar: "بحث" },
  cart: { en: "Cart", ar: "السلة" },
  profile: { en: "Profile", ar: "الملف الشخصي" },

  // Greetings
  goodMorning: { en: "Good morning ☀️", ar: "صباح الخير ☀️" },
  goodEvening: { en: "Good evening 🌙", ar: "مساء الخير 🌙" },
  welcomeBack: { en: "Welcome back!", ar: "أهلاً بعودتك!" },

  // Hero Section
  freshNatural: { en: "Fresh & Natural", ar: "طازج وطبيعي" },
  mrJuice: { en: "MR. Juice", ar: "مستر جوس" },
  freshDrinks: { en: "Fresh Drinks", ar: "مشروبات طازجة" },
  deliveredFast: { en: "Delivered Fast", ar: "توصيل سريع" },
  heroDescription: { en: "100% natural ingredients, made fresh daily. Order now and taste the difference!", ar: "مكونات طبيعية 100%، تُحضّر طازجة يومياً. اطلب الآن وتذوق الفرق!" },
  orderNow: { en: "Order Now", ar: "اطلب الآن" },
  freshDrinksCount: { en: "Fresh Drinks", ar: "مشروب طازج" },
  delivery: { en: "Delivery", ar: "توصيل" },
  rating: { en: "Rating", ar: "التقييم" },

  // Cart
  yourCart: { en: "Your Cart", ar: "سلتك" },
  cartEmpty: { en: "Your cart is empty", ar: "سلتك فارغة" },
  cartEmptyDescription: { en: "Looks like you haven't added any delicious juices yet!", ar: "يبدو أنك لم تضف أي عصائر لذيذة بعد!" },
  browseMenu: { en: "Browse Menu", ar: "تصفح القائمة" },
  clear: { en: "Clear", ar: "مسح" },
  remove: { en: "Remove", ar: "إزالة" },
  orderSummary: { en: "Order Summary", ar: "ملخص الطلب" },
  subtotal: { en: "Subtotal", ar: "المجموع الفرعي" },
  deliveryFeeNote: { en: "Delivery fee will be calculated at checkout", ar: "سيتم حساب رسوم التوصيل عند الدفع" },
  proceedToCheckout: { en: "Proceed to Checkout", ar: "متابعة الدفع" },

  // Checkout
  checkout: { en: "Checkout", ar: "الدفع" },
  items: { en: "items", ar: "منتجات" },
  yourName: { en: "Your Name", ar: "اسمك" },
  enterYourName: { en: "Enter your name", ar: "أدخل اسمك" },
  phoneNumber: { en: "Phone Number", ar: "رقم الهاتف" },
  orderType: { en: "Order Type", ar: "نوع الطلب" },
  deliveryAddress: { en: "Delivery Address", ar: "عنوان التوصيل" },
  enterDeliveryAddress: { en: "Enter your full delivery address", ar: "أدخل عنوان التوصيل كاملاً" },
  specialInstructions: { en: "Special Instructions (Optional)", ar: "تعليمات خاصة (اختياري)" },
  anySpecialRequests: { en: "Any special requests?", ar: "أي طلبات خاصة؟" },
  deliveryFee: { en: "Delivery Fee", ar: "رسوم التوصيل" },
  pickup: { en: "Pickup", ar: "استلام" },
  free: { en: "Free", ar: "مجاني" },
  total: { en: "Total", ar: "الإجمالي" },
  placeOrder: { en: "Place Order", ar: "تأكيد الطلب" },
  placingOrder: { en: "Placing Order...", ar: "جاري تأكيد الطلب..." },
  addressDetails: { en: "Address Details", ar: "تفاصيل العنوان" },
  streetAddress: { en: "Street Address", ar: "عنوان الشارع" },
  enterStreetAddress: { en: "Enter street address", ar: "أدخل عنوان الشارع" },
  building: { en: "Building/Villa", ar: "المبنى/الفيلا" },
  enterBuilding: { en: "Building or villa number", ar: "رقم المبنى أو الفيلا" },
  floor: { en: "Floor", ar: "الطابق" },
  enterFloor: { en: "Floor number", ar: "رقم الطابق" },
  apartment: { en: "Apartment", ar: "الشقة" },
  enterApartment: { en: "Apartment number", ar: "رقم الشقة" },
  landmark: { en: "Landmark", ar: "علامة مميزة" },
  enterLandmark: { en: "Nearby landmark", ar: "علامة مميزة قريبة" },
  fillAllFields: { en: "Fill All", ar: "ملء الكل" },
  clearAllFields: { en: "Clear", ar: "مسح" },

  // Payment Methods
  paymentMethod: { en: "Payment Method", ar: "طريقة الدفع" },
  creditCard: { en: "Credit Card", ar: "بطاقة ائتمان" },
  instaPay: { en: "InstaPay", ar: "إنستا باي" },
  vodafoneCash: { en: "Vodafone Cash", ar: "فودافون كاش" },
  cashOnDelivery: { en: "Cash on Delivery", ar: "الدفع عند الاستلام" },
  
  // InstaPay Instructions
  instaPayInstructions: { en: "InstaPay Payment Instructions", ar: "تعليمات الدفع عبر إنستا باي" },
  instaPayStep1: { en: "Open your banking app and go to InstaPay", ar: "افتح تطبيق البنك واذهب إلى إنستا باي" },
  instaPayStep2: { en: "Send the total amount to the number below", ar: "أرسل المبلغ الإجمالي إلى الرقم أدناه" },
  instaPayStep3: { en: "Take a screenshot and send it via WhatsApp", ar: "خذ لقطة شاشة وأرسلها عبر واتساب" },
  instaPayNumber: { en: "InstaPay Number", ar: "رقم إنستا باي" },
  instaPayName: { en: "Account Name", ar: "اسم الحساب" },
  instaPayNote: { en: "Your order will be confirmed after payment verification", ar: "سيتم تأكيد طلبك بعد التحقق من الدفع" },

  // Profile
  guestUser: { en: "Guest User", ar: "زائر" },
  signInForRewards: { en: "Sign in for faster checkout", ar: "سجل دخولك لإتمام الطلب بشكل أسرع" },
  admin: { en: "Admin", ar: "مدير" },
  openAdminDashboard: { en: "Open Admin Dashboard", ar: "فتح لوحة التحكم" },
  joinMrJuice: { en: "Join MR. Juice", ar: "انضم إلى مستر جوس" },
  joinDescription: { en: "Sign in for exclusive discounts and faster checkout!", ar: "سجل للحصول على خصومات حصرية وإتمام الطلب بشكل أسرع!" },
  signInSignUp: { en: "Sign In / Sign Up", ar: "تسجيل الدخول / إنشاء حساب" },
  orderHistory: { en: "Order History", ar: "سجل الطلبات" },
  savedAddresses: { en: "Saved Addresses", ar: "العناوين المحفوظة" },
  paymentMethods: { en: "Payment Methods", ar: "طرق الدفع" },
  settings: { en: "Settings", ar: "الإعدادات" },
  signOut: { en: "Sign Out", ar: "تسجيل الخروج" },
  madeWithLove: { en: "Made with 💜 in Egypt", ar: "صُنع بـ 💜 في مصر" },

  // Settings
  accountInformation: { en: "Account Information", ar: "معلومات الحساب" },
  deliveryAddresses: { en: "Delivery Addresses", ar: "عناوين التوصيل" },
  changeEmail: { en: "Change Email", ar: "تغيير البريد الإلكتروني" },
  changePassword: { en: "Change Password", ar: "تغيير كلمة المرور" },
  notifications: { en: "Notifications", ar: "الإشعارات" },
  language: { en: "Language", ar: "اللغة" },
  logout: { en: "Logout", ar: "تسجيل الخروج" },
  english: { en: "English", ar: "الإنجليزية" },
  arabic: { en: "Arabic", ar: "العربية" },

  // Orders
  noOrders: { en: "No orders yet", ar: "لا توجد طلبات بعد" },
  noOrdersDescription: { en: "Your order history will appear here once you place an order.", ar: "سيظهر سجل طلباتك هنا بمجرد تقديم طلب." },
  startOrdering: { en: "Start Ordering", ar: "ابدأ الطلب" },
  reorder: { en: "Reorder", ar: "إعادة الطلب" },
  delete: { en: "Delete", ar: "حذف" },
  pending: { en: "Pending", ar: "قيد الانتظار" },
  confirmed: { en: "Confirmed", ar: "مؤكد" },
  preparing: { en: "Preparing", ar: "قيد التحضير" },
  ready: { en: "Ready", ar: "جاهز" },
  completed: { en: "Completed", ar: "مكتمل" },
  cancelled: { en: "Cancelled", ar: "ملغي" },
  orderDeleted: { en: "Order deleted", ar: "تم حذف الطلب" },
  itemsAddedToCart: { en: "Items added to cart!", ar: "تمت إضافة المنتجات للسلة!" },
  signInToViewOrders: { en: "Sign in to view your order history", ar: "سجل الدخول لعرض سجل طلباتك" },

  // Product
  size: { en: "Size", ar: "الحجم" },
  addOns: { en: "Add-ons", ar: "إضافات" },
  addToCart: { en: "Add to Cart", ar: "أضف للسلة" },
  calories: { en: "calories", ar: "سعرة حرارية" },
  standard: { en: "Standard", ar: "عادي" },
  medium: { en: "Medium", ar: "وسط" },
  large: { en: "Large", ar: "كبير" },

  // Categories
  allItems: { en: "All", ar: "الكل" },
  fullMenu: { en: "Full Menu", ar: "القائمة الكاملة" },
  exploreAllDrinks: { en: "Explore all our fresh drinks", ar: "اكتشف جميع مشروباتنا الطازجة" },
  popularItems: { en: "Popular Items", ar: "الأكثر شعبية" },
  popularNow: { en: "Popular Now", ar: "الأكثر طلباً" },
  categories: { en: "Categories", ar: "التصنيفات" },
  noProductsInCategory: { en: "No products in this category yet", ar: "لا توجد منتجات في هذا التصنيف بعد" },
  seeAll: { en: "See All", ar: "عرض الكل" },

  // Category Names
  catSmoothie: { en: "Smoothie", ar: "سموذي" },
  catFreshJuices: { en: "Fresh Juices", ar: "عصاير فريش" },
  catFamilyJuices: { en: "Family Juices", ar: "عصاير عائلية" },
  catMilkshake: { en: "Milkshake", ar: "ميلك شيك" },
  catGelato: { en: "Gelato", ar: "جيلاتو" },
  catWaffles: { en: "Waffles", ar: "وافل" },
  catBelila: { en: "Belila", ar: "بليلة" },
  catOmAli: { en: "Om Ali", ar: "أم علي" },
  catMojito: { en: "Mojito", ar: "موهيتو" },
  catGreekYogurt: { en: "Greek Yogurt", ar: "زبادي يوناني" },
  catFruitSalad: { en: "Fruit Salad", ar: "فروت سلاد" },
  catSundae: { en: "Sundae", ar: "صانداي" },
  catHot: { en: "Hot", ar: "ساخن" },
  catPancakes: { en: "Pancakes", ar: "بان كيك" },

  // Search
  searchPlaceholder: { en: "Search for drinks...", ar: "ابحث عن المشروبات..." },
  searchForJuices: { en: "Search for juices, ingredients...", ar: "ابحث عن العصائر والمكونات..." },
  noResults: { en: "No results found", ar: "لا توجد نتائج" },
  tryDifferentSearch: { en: "Try a different search term", ar: "جرب كلمة بحث مختلفة" },
  whatAreYouCraving: { en: "What are you craving?", ar: "ماذا تشتهي؟" },
  searchDescription: { en: "Search for your favorite juices, smoothies, or ingredients", ar: "ابحث عن عصائرك المفضلة أو السموثي أو المكونات" },
  resultsFor: { en: "results for", ar: "نتائج لـ" },
  result: { en: "result", ar: "نتيجة" },

  // Admin Dashboard
  adminDashboard: { en: "Admin Dashboard", ar: "لوحة التحكم" },
  manageMenuOrders: { en: "Manage your menu & orders", ar: "إدارة القائمة والطلبات" },
  orders: { en: "Orders", ar: "الطلبات" },
  analytics: { en: "Analytics", ar: "التحليلات" },
  products: { en: "Products", ar: "المنتجات" },
  categoriesTab: { en: "Categories", ar: "التصنيفات" },
  sizes: { en: "Sizes", ar: "الأحجام" },
  addons: { en: "Add-ons", ar: "الإضافات" },
  deliveryTab: { en: "Delivery", ar: "التوصيل" },
  team: { en: "Team", ar: "الفريق" },
  muteNotifications: { en: "Mute notifications", ar: "كتم الإشعارات" },
  enableNotifications: { en: "Enable notifications", ar: "تفعيل الإشعارات" },
  noAccessPage: { en: "You don't have access to this page.", ar: "ليس لديك صلاحية الوصول لهذه الصفحة." },
  goHome: { en: "Go Home", ar: "الذهاب للرئيسية" },

  // Misc
  egp: { en: "EGP", ar: "ج.م" },
  saved: { en: "saved", ar: "محفوظ" },
  loading: { en: "Loading...", ar: "جاري التحميل..." },
  error: { en: "Error", ar: "خطأ" },
  success: { en: "Success", ar: "نجاح" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  save: { en: "Save", ar: "حفظ" },
  close: { en: "Close", ar: "إغلاق" },
  back: { en: "Back", ar: "رجوع" },
  confirm: { en: "Confirm", ar: "تأكيد" },
  pleaseEnterName: { en: "Please enter your name", ar: "الرجاء إدخال اسمك" },
  pleaseEnterPhone: { en: "Please enter your phone number", ar: "الرجاء إدخال رقم الهاتف" },
  pleaseSelectOrderType: { en: "Please select pickup or delivery zone", ar: "الرجاء اختيار الاستلام أو منطقة التوصيل" },
  pleaseEnterAddress: { en: "Please enter your delivery address", ar: "الرجاء إدخال عنوان التوصيل" },
  pleaseSelectPayment: { en: "Please select a payment method", ar: "الرجاء اختيار طريقة الدفع" },
  orderPlacedSuccess: { en: "Order placed successfully! 🎉", ar: "تم تأكيد الطلب بنجاح! 🎉" },
  orderNotification: { en: "We'll notify you when it's ready", ar: "سنخبرك عندما يكون جاهزاً" },
  failedToPlaceOrder: { en: "Failed to place order", ar: "فشل في تأكيد الطلب" },
  comingSoon: { en: "Coming Soon", ar: "قريباً" },
  failedToDelete: { en: "Failed to delete order", ar: "فشل في حذف الطلب" },
  deleting: { en: "Deleting...", ar: "جاري الحذف..." },
};

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  const direction: Direction = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    
    // Update font for Arabic
    if (language === "ar") {
      document.body.style.fontFamily = "'Noto Sans Arabic', 'SF Arabic', 'Geeza Pro', 'Arial', sans-serif";
    } else {
      document.body.style.fontFamily = "'Poppins', sans-serif";
    }
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Helper hook to get Egypt time-based greeting
export const useGreeting = (): string => {
  const { t } = useLanguage();
  
  const getEgyptHour = (): number => {
    const now = new Date();
    const egyptTime = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Cairo",
      hour: "numeric",
      hour12: false,
    }).format(now);
    return parseInt(egyptTime, 10);
  };

  const hour = getEgyptHour();
  
  // Morning: 5 AM - 5 PM (17:00)
  if (hour >= 5 && hour < 17) {
    return t("goodMorning");
  }
  // Evening: 5 PM - 5 AM
  return t("goodEvening");
};
