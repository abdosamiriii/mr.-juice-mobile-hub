import { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Mail,
  Lock,
  Bell,
  Globe,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SettingsTab = "main" | "language" | "account" | "password" | "email" | "notifications" | "addresses" | "payments";

// ─── Sub-header ──────────────────────────────────────────
const SubHeader = ({ title, onBack, direction }: { title: string; onBack: () => void; direction: string }) => (
  <div className="sticky top-0 bg-background z-10 px-5 py-4 border-b border-border">
    <div className={`flex items-center gap-3 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
      <button onClick={onBack} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
        <ArrowLeft className={`w-5 h-5 ${direction === "rtl" ? "rotate-180" : ""}`} />
      </button>
      <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
    </div>
  </div>
);

export const SettingsView = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>("main");

  const handleSignOut = async () => {
    await signOut();
    toast.success(t("signOut"));
  };

  const goBack = () => setActiveTab("main");

  // ═══════════════════════════════════════════════════════════
  // ACCOUNT INFORMATION
  // ═══════════════════════════════════════════════════════════
  const AccountView = () => {
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      if (!user) return;
      supabase.from("profiles").select("full_name, phone").eq("user_id", user.id).maybeSingle().then(({ data }) => {
        if (data) {
          setFullName(data.full_name || "");
          setPhone(data.phone || "");
        }
      });
    }, []);

    const handleSave = async () => {
      if (!user) return;
      setSaving(true);
      const { error } = await supabase.from("profiles").update({ full_name: fullName, phone }).eq("user_id", user.id);
      setSaving(false);
      if (error) { toast.error(t("failedToUpdateProfile")); return; }
      toast.success(t("profileUpdated"));
    };

    return (
      <div className="pb-24">
        <SubHeader title={t("accountInformation")} onBack={goBack} direction={direction} />
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("fullName")}</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("enterFullName")} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("phone")}</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("enterPhone")} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("email")}</label>
            <Input value={user?.email || ""} disabled className="bg-muted" />
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full rounded-xl">
            {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // CHANGE PASSWORD
  // ═══════════════════════════════════════════════════════════
  const PasswordView = () => {
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
      if (newPw.length < 6) { toast.error(t("passwordTooShort")); return; }
      if (newPw !== confirmPw) { toast.error(t("passwordsDoNotMatch")); return; }
      setSaving(true);
      const { error } = await supabase.auth.updateUser({ password: newPw });
      setSaving(false);
      if (error) { toast.error(t("failedToChangePassword")); return; }
      toast.success(t("passwordChanged"));
      setNewPw(""); setConfirmPw("");
    };

    return (
      <div className="pb-24">
        <SubHeader title={t("changePassword")} onBack={goBack} direction={direction} />
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("newPassword")}</label>
            <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("confirmNewPassword")}</label>
            <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full rounded-xl">
            {saving ? t("saving") : t("updatePassword")}
          </Button>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // CHANGE EMAIL
  // ═══════════════════════════════════════════════════════════
  const EmailView = () => {
    const [newEmail, setNewEmail] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
      if (!newEmail.includes("@")) { toast.error(t("error")); return; }
      setSaving(true);
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      setSaving(false);
      if (error) { toast.error(t("failedToChangeEmail")); return; }
      toast.success(t("emailChangeRequested"));
      setNewEmail("");
    };

    return (
      <div className="pb-24">
        <SubHeader title={t("changeEmail")} onBack={goBack} direction={direction} />
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("currentEmail")}</label>
            <Input value={user?.email || ""} disabled className="bg-muted" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t("newEmail")}</label>
            <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder={t("enterNewEmail")} />
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full rounded-xl">
            {saving ? t("saving") : t("updateEmail")}
          </Button>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════
  const NotificationsView = () => {
    const [orderUpdates, setOrderUpdates] = useState(() => localStorage.getItem("notif_orders") !== "false");
    const [promotions, setPromotions] = useState(() => localStorage.getItem("notif_promos") !== "false");
    const [soundAlerts, setSoundAlerts] = useState(() => localStorage.getItem("notif_sound") !== "false");

    const toggle = (key: string, value: boolean, setter: (v: boolean) => void) => {
      setter(value);
      localStorage.setItem(key, String(value));
      toast.success(t("notificationsSaved"));
    };

    const items = [
      { label: t("orderUpdates"), desc: t("orderUpdatesDesc"), value: orderUpdates, key: "notif_orders", setter: setOrderUpdates },
      { label: t("promotions"), desc: t("promotionsDesc"), value: promotions, key: "notif_promos", setter: setPromotions },
      { label: t("soundAlerts"), desc: t("soundAlertsDesc"), value: soundAlerts, key: "notif_sound", setter: setSoundAlerts },
    ];

    return (
      <div className="pb-24">
        <SubHeader title={t("notifications")} onBack={goBack} direction={direction} />
        <div className="p-5">
          <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
            {items.map((item, i) => (
              <div
                key={item.key}
                className={`flex items-center justify-between p-4 ${i !== items.length - 1 ? "border-b border-border" : ""} ${direction === "rtl" ? "flex-row-reverse" : ""}`}
              >
                <div className={`flex-1 ${direction === "rtl" ? "text-right" : "text-left"}`}>
                  <p className="font-medium text-foreground text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch checked={item.value} onCheckedChange={(v) => toggle(item.key, v, item.setter)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // SAVED ADDRESSES
  // ═══════════════════════════════════════════════════════════
  const AddressesView = () => {
    type SavedAddress = { id: string; label: string; street: string; building: string; floor: string; apartment: string };
    const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
      try { return JSON.parse(localStorage.getItem("saved_addresses") || "[]"); } catch { return []; }
    });
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ label: "", street: "", building: "", floor: "", apartment: "" });

    const persist = (list: SavedAddress[]) => { setAddresses(list); localStorage.setItem("saved_addresses", JSON.stringify(list)); };

    const handleAdd = () => {
      if (!form.street.trim()) return;
      const addr: SavedAddress = { id: crypto.randomUUID(), ...form };
      persist([...addresses, addr]);
      setForm({ label: "", street: "", building: "", floor: "", apartment: "" });
      setAdding(false);
      toast.success(t("addressSaved"));
    };

    const handleDelete = (id: string) => { persist(addresses.filter((a) => a.id !== id)); toast.success(t("addressDeleted")); };

    return (
      <div className="pb-24">
        <SubHeader title={t("deliveryAddresses")} onBack={goBack} direction={direction} />
        <div className="p-5 space-y-4">
          {addresses.length === 0 && !adding && (
            <p className="text-sm text-muted-foreground text-center py-8">{t("noSavedAddresses")}</p>
          )}
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-card rounded-2xl p-4 border border-border flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{addr.label || t("labelOther")}</p>
                <p className="text-xs text-muted-foreground mt-1">{addr.street}{addr.building ? `, ${addr.building}` : ""}{addr.floor ? `, ${t("floor")} ${addr.floor}` : ""}{addr.apartment ? `, ${t("apartment")} ${addr.apartment}` : ""}</p>
              </div>
              <button onClick={() => handleDelete(addr.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          {adding ? (
            <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder={t("addressLabel")} />
              <Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder={t("streetAddress")} />
              <div className="grid grid-cols-3 gap-2">
                <Input value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} placeholder={t("building")} />
                <Input value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder={t("floor")} />
                <Input value={form.apartment} onChange={(e) => setForm({ ...form, apartment: e.target.value })} placeholder={t("apartment")} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} className="flex-1 rounded-xl">{t("save")}</Button>
                <Button variant="outline" onClick={() => setAdding(false)} className="rounded-xl">{t("cancel")}</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setAdding(true)} className="w-full rounded-xl">
              <Plus className="w-4 h-4 me-2" />{t("addNewAddress")}
            </Button>
          )}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // PAYMENT METHODS (info-only)
  // ═══════════════════════════════════════════════════════════
  const PaymentsView = () => (
    <div className="pb-24">
      <SubHeader title={t("paymentMethodsTitle")} onBack={goBack} direction={direction} />
      <div className="p-5 space-y-3">
        <p className="text-sm text-muted-foreground mb-2">{t("paymentMethodsDesc")}</p>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className={`flex items-center gap-4 p-4 border-b border-border ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-primary" />
            </div>
            <div className={`flex-1 ${direction === "rtl" ? "text-right" : "text-left"}`}>
              <p className="font-medium text-foreground text-sm">{t("cashOnDelivery")}</p>
              <p className="text-xs text-muted-foreground">{t("cashOnDeliveryDesc")}</p>
            </div>
            <Check className="w-5 h-5 text-primary" />
          </div>
          <div className={`flex items-center gap-4 p-4 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div className={`flex-1 ${direction === "rtl" ? "text-right" : "text-left"}`}>
              <p className="font-medium text-foreground text-sm">{t("instaPay")}</p>
              <p className="text-xs text-muted-foreground">{t("instaPayDesc")}</p>
            </div>
            <Check className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // LANGUAGE
  // ═══════════════════════════════════════════════════════════
  const LanguageView = () => (
    <div className="pb-24">
      <SubHeader title={t("language")} onBack={goBack} direction={direction} />
      <div className="p-5">
        <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
          {[
            { code: "en" as const, label: "English", flag: "🇬🇧" },
            { code: "ar" as const, label: "العربية", flag: "🇪🇬" },
          ].map((lang, i) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); goBack(); }}
              className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${i === 0 ? "border-b border-border" : ""} ${direction === "rtl" ? "flex-row-reverse" : ""}`}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><span className="text-lg">{lang.flag}</span></div>
              <div className={`flex-1 ${direction === "rtl" ? "text-right" : "text-left"}`}><p className="font-medium text-foreground">{lang.label}</p></div>
              {language === lang.code && <Check className="w-5 h-5 text-primary" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // ROUTE
  // ═══════════════════════════════════════════════════════════
  if (activeTab === "account") return <AccountView />;
  if (activeTab === "password") return <PasswordView />;
  if (activeTab === "email") return <EmailView />;
  if (activeTab === "notifications") return <NotificationsView />;
  if (activeTab === "addresses") return <AddressesView />;
  if (activeTab === "payments") return <PaymentsView />;
  if (activeTab === "language") return <LanguageView />;

  // ═══════════════════════════════════════════════════════════
  // MAIN SETTINGS LIST
  // ═══════════════════════════════════════════════════════════
  const menuItems = [
    { icon: User, label: t("accountInformation"), action: () => setActiveTab("account") },
    { icon: MapPin, label: t("deliveryAddresses"), action: () => setActiveTab("addresses") },
    { icon: CreditCard, label: t("paymentMethods"), action: () => setActiveTab("payments") },
    { icon: Mail, label: t("changeEmail"), action: () => setActiveTab("email") },
    { icon: Lock, label: t("changePassword"), action: () => setActiveTab("password") },
    { icon: Bell, label: t("notifications"), action: () => setActiveTab("notifications") },
    { icon: Globe, label: t("language"), badge: language === "ar" ? "العربية" : "English", action: () => setActiveTab("language") },
  ];

  return (
    <div className="pb-24">
      <div className="sticky top-0 bg-background z-10 px-5 py-4 border-b border-border">
        <h1 className="font-display text-xl font-bold text-foreground">{t("settings")}</h1>
      </div>
      <div className="p-5">
        <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${index !== menuItems.length - 1 ? "border-b border-border" : ""} ${direction === "rtl" ? "flex-row-reverse" : ""}`}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <item.icon className="w-5 h-5 text-foreground" />
              </div>
              <div className={`flex-1 ${direction === "rtl" ? "text-right" : "text-left"}`}>
                <p className="font-medium text-foreground">{item.label}</p>
              </div>
              {"badge" in item && item.badge && (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{item.badge}</span>
              )}
              <ChevronRight className={`w-5 h-5 text-muted-foreground ${direction === "rtl" ? "rotate-180" : ""}`} />
            </button>
          ))}
        </div>
        {user && (
          <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 mt-6 py-4 text-destructive font-medium">
            <LogOut className="w-5 h-5" />{t("logout")}
          </button>
        )}
      </div>
    </div>
  );
};
