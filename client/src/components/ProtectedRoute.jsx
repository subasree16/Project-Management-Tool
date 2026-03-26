import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="screen-center">Loading...</div>;
  }

  return token ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;

