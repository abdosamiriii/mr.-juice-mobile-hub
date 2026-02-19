import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import logoImage from "@/assets/mr-juice-logo-new.jpg";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery tokens in the URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    } else {
      // No recovery token — redirect home
      navigate("/");
    }
  }, [navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = schema.parse({ password, confirm });
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: validated.password });
      if (error) {
        toast.error(error.message);
      } else {
        setDone(true);
        toast.success("Password updated successfully!");
        setTimeout(() => navigate("/"), 2500);
      }
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  if (!isRecovery) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="bg-primary rounded-b-[2.5rem] pt-14 pb-20 flex flex-col items-center relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-primary-foreground/10 rounded-full" />
        <div className="absolute top-12 -left-6 w-16 h-16 bg-primary-foreground/10 rounded-full" />
        <div className="w-24 h-24 rounded-full bg-card overflow-hidden shadow-elevated ring-4 ring-card/40">
          <img src={logoImage} alt="MR. Juice" className="w-full h-full object-cover" />
        </div>
        <p className="text-primary-foreground/70 text-sm mt-3 font-medium">Set a new password</p>
      </div>

      <div className="flex-1 px-5 -mt-10 relative z-10">
        <div className="bg-card rounded-3xl shadow-elevated p-6">
          {done ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">Password Updated!</h2>
              <p className="text-sm text-muted-foreground">Redirecting you to the app…</p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">New Password</h2>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-sm">Password <span className="text-xs">(min. 8 chars)</span></Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-3xl bg-muted border-transparent focus-visible:border-primary px-5 ps-11 pe-12"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-sm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="h-12 rounded-3xl bg-muted border-transparent focus-visible:border-primary px-5 ps-11"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 text-base font-bold rounded-full" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
