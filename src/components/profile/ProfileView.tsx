import { useNavigate } from "react-router-dom";
import { User, MapPin, CreditCard, Gift, History, Settings, LogOut, ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import logoImage from "@/assets/mr-juice-logo-new.jpg";

export const ProfileView = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut, isLoading } = useAuth();

  const menuItems = [
    { icon: History, label: "Order History", badge: "3 orders" },
    { icon: MapPin, label: "Saved Addresses", badge: "2 saved" },
    { icon: CreditCard, label: "Payment Methods", badge: null },
    { icon: Gift, label: "Rewards & Points", badge: "250 pts" },
    { icon: Settings, label: "Settings", badge: null },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 pb-24">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
          <User className="w-10 h-10 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-foreground">
            {user ? (user.user_metadata?.full_name || user.email?.split("@")[0]) : "Guest User"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {user ? user.email : "Sign in for rewards & faster checkout"}
          </p>
          {isAdmin && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Admin Dashboard Button */}
      {isAdmin && (
        <Button 
          onClick={() => navigate("/admin")} 
          className="w-full mb-6"
          variant="default"
        >
          <Shield className="w-4 h-4 mr-2" />
          Open Admin Dashboard
        </Button>
      )}

      {/* Sign In CTA - Only show if not logged in */}
      {!user && (
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-5 mb-6 border border-primary/20">
          <div className="flex items-start gap-4">
            <img 
              src={logoImage} 
              alt="MR. Juice" 
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Join MR. Juice Rewards</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Earn points on every order and get exclusive discounts!
              </p>
              <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
                Sign In / Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
              index !== menuItems.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <item.icon className="w-5 h-5 text-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{item.label}</p>
            </div>
            {item.badge && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Logout Button - Only show if logged in */}
      {user && (
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 mt-6 py-4 text-destructive font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      )}

      {/* App Info */}
      <div className="text-center mt-8">
        <p className="text-xs text-muted-foreground">MR. Juice v1.0.0</p>
        <p className="text-xs text-muted-foreground mt-1">Made with 💜 in Egypt</p>
      </div>
    </div>
  );
};
