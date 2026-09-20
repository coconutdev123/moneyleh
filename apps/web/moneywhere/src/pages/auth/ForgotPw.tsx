import { useState } from "react";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import AuthShell from "../../components/AuthShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setMessage(""); setError(""); try { await new Promise((r) => setTimeout(r, 1000)); setMessage("If the email exists, a reset link has been sent."); } catch { setError("Something went wrong. Please try again."); } finally { setLoading(false); } };

  return <AuthShell eyebrow="A fresh start" title="Reset your password" description="Enter your email and we’ll send a gentle nudge to get you back in." footer={<Link to="/sign-in" className="inline-flex items-center gap-2 font-bold text-[#627069] transition-colors hover:text-[#e88976]"><ArrowLeft size={15} /> Back to sign in</Link>}>
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="space-y-2"><Label htmlFor="email" className="text-xs font-bold text-[#627069]">Email address</Label><div className="relative"><Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aaa9f]" /><Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl border-[#dce6dc] bg-[#f8f6f0] pl-10 shadow-none focus-visible:border-[#9ed9c2] focus-visible:ring-[#9ed9c2]/30" /></div></div>
      {error && <div className="rounded-xl bg-[#fff0ec] px-4 py-3 text-center text-sm font-semibold text-[#bf624f]">{error}</div>}
      {message && <div className="rounded-xl bg-[#edf7ed] px-4 py-3 text-center text-sm font-semibold text-[#4e7460]">{message}</div>}
      <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-[#e88976] font-bold text-white shadow-[3px_3px_0_#27352f] hover:bg-[#d97865]">{loading ? "Sending..." : <><Send size={16} /> Send reset link</>}</Button>
    </form>
  </AuthShell>;
}