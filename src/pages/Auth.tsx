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
      {/* Logo area - centered circle on white background matching reference */}
      <div className="flex flex-col items-center pt-16 pb-8">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center shadow-yellow ring-4 ring-secondary/30 mb-4 animate-logo-entrance">
          <img src={logoImage} alt="MR. Juice" className="w-16 h-16 rounded-full object-cover" />
        </div>
      </div>

      {/* Form card */}
      <div className="flex-1 px-6">
        <div className="bg-card rounded-3xl shadow-elevated p-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted rounded-full p-1 h-12">
              <TabsTrigger value="signin" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-sm">Login</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-sm">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-muted-foreground text-sm">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-full bg-background border-border px-5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-muted-foreground text-sm">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-full bg-background border-border px-5"
                  />
                </div>
                <p className="text-end text-xs text-primary font-medium cursor-pointer">Forgot Password?</p>
                <Button type="submit" variant="pink" className="w-full h-14 text-base font-bold rounded-full" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  Don't have an account? <span className="text-primary font-semibold cursor-pointer">Sign up</span>
                </p>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-muted-foreground text-sm">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 rounded-full bg-background border-border px-5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-muted-foreground text-sm">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-full bg-background border-border px-5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-muted-foreground text-sm">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-full bg-background border-border px-5"
                  />
                </div>
                <Button type="submit" variant="pink" className="w-full h-14 text-base font-bold rounded-full" disabled={loading}>
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
