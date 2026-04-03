import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";

export function SettingsManager() {
  const queryClient = useQueryClient();
  const [newPin, setNewPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const { data: currentPin, isLoading } = useQuery({
    queryKey: ["staff-pin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "staff_pin")
        .single();
      if (error) throw error;
      return data?.value || "";
    },
  });

  const updatePin = useMutation({
    mutationFn: async (pin: string) => {
      const { error } = await supabase
        .from("app_settings")
        .update({ value: pin, updated_at: new Date().toISOString() })
        .eq("key", "staff_pin");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-pin"] });
      setNewPin("");
      toast.success("Staff PIN updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update PIN: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = newPin.trim();
    if (!pin || pin.length < 4) {
      toast.error("PIN must be at least 4 characters");
      return;
    }
    updatePin.mutate(pin);
  };

  return (
    <div className="max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Staff Access PIN
          </CardTitle>
          <CardDescription>
            This PIN is used by employees to access the staff orders dashboard at /staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current PIN */}
            <div>
              <Label className="text-xs text-muted-foreground">Current PIN</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type={showPin ? "text" : "password"}
                  value={isLoading ? "..." : currentPin || ""}
                  readOnly
                  className="font-mono tracking-widest"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* New PIN */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="new-pin">New PIN</Label>
                <Input
                  id="new-pin"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter new PIN (min 4 characters)"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="font-mono tracking-widest mt-1"
                  maxLength={10}
                />
              </div>
              <Button
                type="submit"
                disabled={!newPin.trim() || newPin.trim().length < 4 || updatePin.isPending}
                className="w-full"
              >
                <Save className="h-4 w-4 me-2" />
                {updatePin.isPending ? "Saving..." : "Update PIN"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
