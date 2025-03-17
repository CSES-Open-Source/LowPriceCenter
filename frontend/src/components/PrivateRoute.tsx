import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useContext(FirebaseContext);
  if (loading) {
    return;
  }
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
}
