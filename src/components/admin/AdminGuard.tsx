import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Shield } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard — server-side role check before rendering any admin UI.
 * Redirects unauthenticated users to /auth and non-admins to /.
 * Never trusts client-side state alone — role check runs via the
 * security-definer has_role() DB function through AuthContext.
 */
export const AdminGuard = ({ children }: AdminGuardProps) => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};
