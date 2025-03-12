import { Route, Routes } from "react-router";
import AffiliateRoutes from "../features/affiliate/routes";
import AuthRoutes from "../features/auth/routes";
import Landing from "../features/landing/routes/landing";
import Layout from "./Layout";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="affiliate/*" element={<AffiliateRoutes />} />
        </Route>
      </Route>

      {/* Public routes */}
      <Route path="auth/*" element={<AuthRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
