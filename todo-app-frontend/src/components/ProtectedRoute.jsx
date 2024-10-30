import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../UserContex";

const ProtectedRoute = ({ element }) => {
  const { user } = useContext(UserContext);
  if (!user) return <Navigate to="/login" />;
  return element;
};
export default ProtectedRoute;
