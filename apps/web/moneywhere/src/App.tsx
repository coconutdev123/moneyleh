import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import {useConvexAuth} from "convex/react";
import Dashboard from "./pages/features/dashboard";
import Profile from "./pages/profile/profile";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPw";
import Confirmation from "./pages/auth/confirmation"; 
import Landing from "./pages/features/landing";
import Expense from "./pages/features/expense-form";
import Wishlist from "./pages/features/wishlist";
import Overview from "./pages/features/overview";
import AccountInfo from "./pages/profile/account-info";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Footer from "./components/Footer";
import { Toaster } from "@shared/components/ui/sonner";

function PrivateRoute({ element }: { element: ReactElement }) {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return isAuthenticated ? element : <Navigate to="/sign-in" replace />;
}

export default function App(){

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirmation" element={<Confirmation />} />
        
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/add-expense" element={<PrivateRoute element={<Expense />} />} />
        <Route path="/overview" element={<PrivateRoute element={<Overview />} />} />
        <Route path="/wish-list" element={<PrivateRoute element={<Wishlist />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/account-info" element={<PrivateRoute element={<AccountInfo />} />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
       

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

      </Routes>
      <Footer />
      <Toaster />
    </BrowserRouter>
  );
}
