import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import logoImage from "@/assets/mr-juice-logo-new.jpg";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long"),
});

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
});

const forgotSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, isLoading } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showForgot, setShowForgot] = useState(false);

  // Sign in state
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siShowPw, setSiShowPw] = useState(false);

  // Sign up state
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suShowPw, setSuShowPw] = useState(false);

  // Forgot password
  const [fpEmail, setFpEmail] = useState("");
  const [fpSent, setFpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast.error("Apple sign-in failed. Please try again.");
      }
    } catch {
      toast.error("Apple sign-in failed. Please try again.");
    } finally {
      setAppleLoading(false);
    }
  };
  useEffect(() => {
    if (user && !isLoading) navigate("/");
  }, [user, isLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = signInSchema.parse({ email: siEmail, password: siPassword });
      setLoading(true);
      const { error } = await signIn(validated.email, validated.password);
      if (error) {
        toast.error(
          error.message.includes("Invalid login credentials")
            ? "Incorrect email or password"
            : error.message
        );
      } else {
        toast.success("Welcome back! 👋");
        navigate("/");
      }
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = signUpSchema.parse({ fullName: suName, email: suEmail, password: suPassword });
      setLoading(true);
      const { error } = await signUp(validated.email, validated.password, validated.fullName);
      if (error) {
        toast.error(
          error.message.includes("already registered")
            ? "This email is already registered — sign in instead"
            : error.message
        );
      } else {
        toast.success("Account created! Please check your email to confirm.");
      }
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = forgotSchema.parse({ email: fpEmail });
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(validated.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        setFpSent(true);
        toast.success("Password reset email sent!");
      }
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const inputCls = "h-12 rounded-3xl bg-muted border-transparent focus-visible:border-primary px-5 ps-11";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Purple header */}
      <div className="bg-primary rounded-b-[2.5rem] pt-14 pb-20 flex flex-col items-center relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-primary-foreground/10 rounded-full" />
        <div className="absolute top-12 -left-6 w-16 h-16 bg-primary-foreground/10 rounded-full" />
        <div className="absolute bottom-4 right-12 w-10 h-10 bg-primary-foreground/15 rounded-full" />
        <div className="w-24 h-24 rounded-full bg-card overflow-hidden shadow-elevated ring-4 ring-card/40 animate-logo-entrance">
          <img src={logoImage} alt="MR. Juice" className="w-full h-full object-cover" />
        </div>
        <p className="text-primary-foreground/70 text-sm mt-3 font-medium">
          {showForgot ? "Reset your password" : tab === "signin" ? "Sign in to your account" : "Create an account"}
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 px-5 -mt-10 relative z-10">
        <div className="bg-card rounded-3xl shadow-elevated p-6">

          {/* Forgot password view */}
          {showForgot ? (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Forgot Password</h2>
              {fpSent ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">Check your inbox</p>
                  <p className="text-sm text-muted-foreground">We sent a reset link to <strong>{fpEmail}</strong></p>
                  <Button variant="outline" className="rounded-full w-full" onClick={() => { setShowForgot(false); setFpSent(false); setFpEmail(""); }}>
                    Back to Sign In
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="your@email.com" value={fpEmail} onChange={(e) => setFpEmail(e.target.value)} required className={inputCls} />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-full font-bold" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                  </Button>
                  <button type="button" onClick={() => setShowForgot(false)} className="w-full text-center text-sm text-primary font-medium">
                    ← Back to Sign In
                  </button>
                </form>
              )}
            </div>
          ) : (
            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted rounded-full p-1 h-12">
                <TabsTrigger value="signin" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-sm">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-sm">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Sign In */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-sm">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="email" placeholder="your@email.com" value={siEmail} onChange={(e) => setSiEmail(e.target.value)} required className={inputCls} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type={siShowPw ? "text" : "password"} placeholder="••••••••" value={siPassword} onChange={(e) => setSiPassword(e.target.value)} required className={inputCls + " pe-12"} />
                      <button type="button" onClick={() => setSiShowPw(!siShowPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {siShowPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="button" onClick={() => setShowForgot(true)} className="text-primary text-xs font-semibold w-full text-right">
                    Forgot password?
                  </button>
                  <Button type="submit" className="w-full h-14 text-base font-bold rounded-full" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                  </Button>

                  <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-14 rounded-full font-semibold text-base gap-3 border-border"
                    onClick={handleAppleSignIn}
                    disabled={appleLoading}
                  >
                    {appleLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                    )}
                    Continue with Apple
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => setTab("signup")} className="text-primary font-semibold">Sign up</button>
                  </p>
                </form>
              </TabsContent>

              {/* Sign Up */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-sm">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="text" placeholder="Your name" value={suName} onChange={(e) => setSuName(e.target.value)} required className={inputCls} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-sm">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="email" placeholder="your@email.com" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} required className={inputCls} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-sm">Password <span className="text-xs">(min. 8 chars)</span></Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type={suShowPw ? "text" : "password"} placeholder="••••••••" value={suPassword} onChange={(e) => setSuPassword(e.target.value)} required className={inputCls + " pe-12"} />
                      <button type="button" onClick={() => setSuShowPw(!suShowPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {suShowPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-14 text-base font-bold rounded-full" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                  </Button>

                  <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-14 rounded-full font-semibold text-base gap-3 border-border"
                    onClick={handleAppleSignIn}
                    disabled={appleLoading}
                  >
                    {appleLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                    )}
                    Continue with Apple
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setTab("signin")} className="text-primary font-semibold">Sign in</button>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 mb-4">
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;
