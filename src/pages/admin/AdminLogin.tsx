import { useState, FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { usePageMeta } from "@/hooks/usePageMeta";

const AdminLogin = () => {
  usePageMeta("Admin Login — Hotel GuestHub", "Sign in to manage your property.");
  const { user, isAdmin, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user && isAdmin) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/admin";
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: "Welcome back" });
        navigate("/admin", { replace: true });
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast({
          title: "Account created",
          description:
            "Confirm your email if required, then ask an existing admin to grant you the admin role.",
        });
      }
    } catch (err) {
      toast({
        title: "Authentication failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-secondary/30">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-ink text-background">
        <Link to="/" className="font-serif text-2xl">Hotel GuestHub</Link>
        <div className="space-y-4 max-w-sm">
          <p className="eyebrow text-background/60">Property admin</p>
          <h1 className="text-4xl font-serif leading-tight">
            Manage your stay experience, from one place.
          </h1>
          <p className="text-background/70">
            Requests, services, rooms, and content — all editable, all yours.
          </p>
        </div>
        <p className="text-xs text-background/50">© {new Date().getFullYear()} Hotel GuestHub</p>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="font-serif text-3xl">
              {mode === "login" ? "Sign in" : "Create admin account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {mode === "login"
                ? "Use your admin email and password."
                : "After signup, an existing admin must grant you the admin role."}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              required
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </Button>

          <button
            type="button"
            onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
            className="text-sm text-muted-foreground hover:text-foreground w-full text-center"
          >
            {mode === "login"
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            <Link to="/" className="underline underline-offset-4">← Back to website</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
