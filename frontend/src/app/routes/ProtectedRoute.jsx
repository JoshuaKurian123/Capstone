import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AccessDenied from "../shared/AccessDenied";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { loggedInUser } = useAuth();

  const role = loggedInUser?.user?.role;

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  return children;
}
