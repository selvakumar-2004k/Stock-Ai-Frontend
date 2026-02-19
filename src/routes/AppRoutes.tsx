import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

import Dashboard from "../pages/Dashboard";
import Portfolio from "../pages/Portfolio";
import AssetDetails from "../pages/AssetDetails";
import Transactions from "../pages/Transactions";
import AIInsights from "../pages/AIInsights";
import Watchlist from "../pages/Watchlist";
import Reports from "../pages/Reports";
// import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:id" element={<AssetDetails />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/reports" element={<Reports />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
