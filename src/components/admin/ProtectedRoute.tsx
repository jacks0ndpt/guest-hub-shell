import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center p-8 text-center">
        <div className="max-w-md space-y-3">
          <h1 className="font-serif text-3xl">Not authorised</h1>
          <p className="text-muted-foreground">
            Your account is signed in but does not have admin access. Ask an existing admin
            to grant you the <code className="px-1 py-0.5 rounded bg-muted">admin</code> role.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
