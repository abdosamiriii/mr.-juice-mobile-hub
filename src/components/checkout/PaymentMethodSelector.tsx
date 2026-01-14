import { Smartphone, Banknote, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type PaymentMethod = "instapay" | "cash";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector = ({
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) => {
  const { t, direction } = useLanguage();

  const paymentMethods = [
    {
      id: "cash" as PaymentMethod,
      label: t("cashOnDelivery"),
      icon: Banknote,
      color: "from-amber-500 to-amber-600",
    },
    {
      id: "instapay" as PaymentMethod,
      label: t("instaPay"),
      icon: Smartphone,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {paymentMethods.map((method) => {
        const isSelected = selectedMethod === method.id;
        return (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
              isSelected
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            } ${direction === "rtl" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center`}
            >
              <method.icon className="w-5 h-5 text-white" />
            </div>
            <span
              className={`font-medium text-sm text-foreground ${
                direction === "rtl" ? "text-right" : "text-left"
              }`}
            >
              {method.label}
            </span>
            {isSelected && (
              <div className="absolute top-2 right-2">
                <Check className="w-4 h-4 text-primary" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export type { PaymentMethod };
