import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const requiredRole = "admin";

  if (loading) {
    return (
      <div className="container" style={{ padding: "96px 0" }}>
        <div className="empty-state">
          <div className="spinner" />
          <h3 style={{ marginTop: 18 }}>Checking secure session</h3>
          <p>Verifying the signed JWT before opening the admin area.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location, requiredRole }} />;
  }

  if (user.role !== requiredRole) {
    return <Navigate to="/login" replace state={{ from: location, requiredRole, reason: "role" }} />;
  }

  return children;
}