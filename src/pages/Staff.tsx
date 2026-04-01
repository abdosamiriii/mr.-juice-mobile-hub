import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Package, Volume2, VolumeX, Lock } from "lucide-react";
import { StaffOrders } from "@/components/staff/StaffOrders";
import { StaffAvailability } from "@/components/staff/StaffAvailability";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import logoImage from "@/assets/mr-juice-logo-new.jpg";

const StaffPinScreen = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Validate PIN by trying to call an RPC that checks it
      const { data, error: dbError } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "staff_pin")
        .single();

      if (dbError) throw dbError;

      if (data?.value === pin.trim()) {
        sessionStorage.setItem("staff_authenticated", "true");
        sessionStorage.setItem("staff_pin", pin.trim());
        onAuthenticated();
      } else {
        setError("Incorrect PIN");
        setPin("");
      }
    } catch {
      setError("Unable to verify PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <img src={logoImage} alt="MR. Juice" className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staff Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter access code to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="password"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              className="text-center text-2xl tracking-[0.5em] pl-10 h-14 rounded-2xl"
              autoFocus
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full h-12 rounded-2xl text-base" disabled={loading || !pin.trim()}>
            {loading ? "Verifying..." : "Enter"}
          </Button>
        </form>
      </div>
    </div>
  );
};

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [soundEnabled, setSoundEnabled] = useState(true);

  useOrderNotifications(soundEnabled);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="MR. Juice" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h1 className="font-bold text-lg text-foreground">Staff Dashboard</h1>
              <p className="text-xs text-muted-foreground">Orders & Availability</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute notifications" : "Enable notifications"}
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-primary" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                sessionStorage.removeItem("staff_authenticated");
                sessionStorage.removeItem("staff_pin");
                window.location.reload();
              }}
            >
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-4 max-w-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Availability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders"><StaffOrders /></TabsContent>
          <TabsContent value="availability"><StaffAvailability /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const Staff = () => {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("staff_authenticated") === "true"
  );

  if (!authenticated) {
    return <StaffPinScreen onAuthenticated={() => setAuthenticated(true)} />;
  }

  return <StaffDashboard />;
};

export default Staff;
