import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

const MONTHS_2026 = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTHS_2026_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const DAYS_EN = ["S", "M", "T", "W", "T", "F", "S"];
const DAYS_AR = ["أ", "إ", "ث", "أ", "خ", "ج", "س"];

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

const DEFAULT_LOYALTY: Record<number, number[]> = {
  0: [3, 7, 12, 18, 25],
  1: [1, 5, 14, 20, 28],
  2: [2, 9, 15, 22],
  3: [4, 11, 17, 24, 30],
  4: [6, 13, 19, 27],
  5: [1, 8, 15, 21, 29],
};

interface LoyaltyCalendarProps {
  className?: string;
}

export const LoyaltyCalendar = ({ className }: LoyaltyCalendarProps) => {
  const { language, t } = useLanguage();
  const currentMonth = new Date().getMonth();
  const months = language === "ar" ? MONTHS_2026_AR : MONTHS_2026;
  const days = language === "ar" ? DAYS_AR : DAYS_EN;

  const [loyaltyData, setLoyaltyData] = useState<Record<number, number[]>>(() => {
    try {
      const saved = localStorage.getItem("loyalty_data");
      return saved ? JSON.parse(saved) : DEFAULT_LOYALTY;
    } catch { return DEFAULT_LOYALTY; }
  });

  const totalPoints = Object.values(loyaltyData).reduce((sum, arr) => sum + arr.length * 10, 0);

  const handleReset = () => {
    setLoyaltyData({});
    localStorage.setItem("loyalty_data", JSON.stringify({}));
    toast.success(t("calendarReset"));
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            {language === "ar" ? "تقويم الولاء 2026" : "Loyalty Calendar 2026"}
          </h3>
          <p className="text-sm text-muted-foreground">{t("pointsEarned")}: {totalPoints} PT</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="rounded-xl gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          {t("resetCalendar")}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 12 }, (_, monthIndex) => {
          const daysInMonth = getDaysInMonth(monthIndex, 2026);
          const firstDay = getFirstDayOfMonth(monthIndex, 2026);
          const loyaltyDays = loyaltyData[monthIndex] || [];
          const isCurrent = monthIndex === currentMonth;

          return (
            <div key={monthIndex} className={`bg-card rounded-2xl p-3 shadow-card ${isCurrent ? "ring-2 ring-primary" : ""}`}>
              <p className={`text-xs font-bold mb-2 text-center ${isCurrent ? "text-primary" : "text-foreground"}`}>
                {months[monthIndex]}
              </p>
              <div className="grid grid-cols-7 gap-px mb-1">
                {days.map((d, i) => (
                  <span key={i} className="text-[8px] text-muted-foreground text-center">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px">
                {Array.from({ length: firstDay }, (_, i) => (
                  <span key={`empty-${i}`} className="w-full aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const isLoyalty = loyaltyDays.includes(day);
                  return (
                    <span
                      key={day}
                      className={`w-full aspect-square rounded-sm flex items-center justify-center text-[7px] font-medium ${
                        isLoyalty ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"
                      }`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
