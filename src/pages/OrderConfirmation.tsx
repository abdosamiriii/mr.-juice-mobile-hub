import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home } from "lucide-react";
import logoImage from "@/assets/mr-juice-logo-new.jpg";
import { useLanguage } from "@/context/LanguageContext";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id") || "--------";
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
      {/* Logo in primary circle */}
      <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center shadow-button mb-6 ring-4 ring-primary/20">
        <img src={logoImage} alt="MR. Juice" className="w-20 h-20 rounded-full object-cover" />
      </div>

      {/* Check icon */}
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-10 h-10 text-primary" />
      </div>

      {/* Thank you */}
      <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">
        {language === "ar" ? "شكراً لك!" : "Thank You!"}
      </h1>
      <p className="text-muted-foreground text-center max-w-xs mb-6">
        {language === "ar"
          ? "تم استلام طلبك بنجاح وسيتم تحضيره قريباً"
          : "Your order has been received and will be prepared shortly"}
      </p>

      {/* Order number */}
      <div className="bg-card rounded-3xl p-6 shadow-card w-full max-w-xs text-center mb-8">
        <p className="text-sm text-muted-foreground mb-1">
          {language === "ar" ? "رقم الطلب" : "Order Number"}
        </p>
        <p className="font-display text-2xl font-bold text-primary tracking-wider">
          #{orderId.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Back to home */}
      <Button
        variant="default"
        size="lg"
        className="rounded-full w-full max-w-xs"
        onClick={() => navigate("/")}
      >
        <Home className="w-5 h-5 me-2" />
        {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
      </Button>
    </div>
  );
};

export default OrderConfirmation;
