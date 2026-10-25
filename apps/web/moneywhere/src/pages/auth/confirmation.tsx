import { Check, Leaf, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@shared/components/ui/button";
import AuthShell from "../../components/AuthShell";

export default function Confirmation() {
  return <AuthShell eyebrow="One last little step" title="Check your email" description="We sent a confirmation link to your inbox. Click it to finish setting up your account." footer={<span>Need help? <Link to="/sign-in" className="font-bold text-[#e88976] hover:underline">Return to sign in</Link></span>}>
    <div className="flex flex-col items-center text-center"><div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#edf7ed] text-[#4e7460] shadow-[4px_4px_0_#9ed9c2]"><Mail size={34} strokeWidth={1.8} /><span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#f8d66d] text-[#27352f]"><Check size={15} strokeWidth={3} /></span></div><p className="text-sm leading-6 text-[#75837b]">Once you confirm, you’ll be ready to start making your money feel a little clearer.</p><Link to="/sign-in" className="mt-7 w-full"><Button className="h-12 w-full rounded-xl bg-[#27352f] font-bold text-white shadow-[3px_3px_0_#f8d66d] hover:bg-[#3b4d44]"><Leaf size={16} /> Back to sign in</Button></Link></div>
  </AuthShell>;
}