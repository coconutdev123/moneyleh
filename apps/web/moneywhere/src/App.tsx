import { type ReactElement, useEffect } from "react";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import Confirmation from "./pages/auth/confirmation";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import ForgotPassword from "./pages/auth/ForgotPw";
import Dashboard from "./pages/features/dashboard";
import Landing from "./pages/features/landing";

function PrivateRoute({element} : {element: ReactElement}){
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
        {/* <Route path="/" element={<Landing />} /> */}
        
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirmation" element={<Confirmation />} />

        {/* <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

