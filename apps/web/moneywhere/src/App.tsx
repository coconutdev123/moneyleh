import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./pages/features/dashboard";
import Profile from "./pages/profile/profile";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPw";
import Confirmation from "./pages/auth/confirmation"; 
import Landing from "./pages/features/landing";
import AccountInfo from "./pages/profile/account-info";
import { Toaster } from "@shared/components/ui/sonner";

export default function App(){

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path = "/dashboard" element = {<Dashboard/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account-info" element={<AccountInfo />} />

        {/* <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} /> */}
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

