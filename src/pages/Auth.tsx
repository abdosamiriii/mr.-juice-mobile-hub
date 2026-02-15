import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";
import logoImage from "@/assets/mr-juice-logo-new.jpg";

const authSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long"),
  fullName: z.string().trim().max(100, "Name too long").optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = authSchema.parse({ email, password });
      setLoading(true);
      const { error } = await signIn(validated.email, validated.password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = authSchema.parse({ email, password, fullName });
      setLoading(true);
      const { error } = await signUp(validated.email, validated.password, validated.fullName);
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Please sign in.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Account created! Welcome to MR. Juice!");
        navigate("/");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Yellow header area */}
      <div className="bg-secondary pt-16 pb-12 flex flex-col items-center rounded-b-[3rem] shadow-yellow relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-primary/10 rounded-full" />
        <div className="absolute bottom-4 -left-6 w-20 h-20 bg-primary/10 rounded-full" />
        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-elevated ring-4 ring-white mb-4 animate-logo-entrance">
          <img src={logoImage} alt="MR. Juice" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">Welcome to MR. Juice</h1>
        <p className="text-foreground/60 text-sm mt-1">Sign in to your account</p>
      </div>

      {/* Form area */}
      <div className="flex-1 px-6 -mt-6 relative z-10">
        <div className="bg-card rounded-3xl shadow-elevated p-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted rounded-2xl p-1">
              <TabsTrigger value="signin" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-2xl bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-2xl bg-background border-border"
                  />
                </div>
                <Button type="submit" variant="golden" className="w-full h-14 text-base font-bold rounded-2xl" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 rounded-2xl bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-2xl bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-2xl bg-background border-border"
                  />
                </div>
                <Button type="submit" variant="golden" className="w-full h-14 text-base font-bold rounded-2xl" disabled={loading}>
                  {loading ? "Creating account..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
