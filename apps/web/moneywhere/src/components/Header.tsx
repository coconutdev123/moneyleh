
import { Button } from "@shared/components/ui/button";
import { Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {

    const navigate = useNavigate();

    return (
    <header className="flex items-center justify-between rounded-[24px] border border-[#dce6dc] bg-white/85 px-4 py-3 shadow-[0_10px_24px_rgba(39,53,47,0.04)] backdrop-blur-sm sm:px-5">
        <div className="flex items-center gap-4">
        <button type="button" className="hidden items-center gap-2 text-[#27352f] sm:flex" onClick={() => navigate("/")} aria-label="Go to moneyleh home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#27352f] text-[#f8d66d] shadow-[2px_2px_0_#9ed9c2]"><Leaf size={16} /></span>
            <span className="text-sm font-black tracking-[-0.04em]">moneyleh</span>
        </button>
        <div className="flex items-center gap-1">
        <Button
            variant= "ghost"
            size="sm"
            className="rounded-xl px-3 py-2 text-sm font-bold text-[#627069] hover:bg-[#edf7ed] hover:text-[#27352f]"
            onClick={() => navigate("/dashboard")}
        >
            Dashboard
        </Button>
        <Button
            variant="ghost"
            size="sm"
            className="rounded-xl px-3 py-2 text-sm font-bold text-[#627069] hover:bg-[#edf7ed] hover:text-[#27352f]"
            onClick={() => navigate("/overview")}
        >
            Overview
        </Button>
        <Button
            size="sm"
            className="rounded-xl bg-[#e88976] px-4 py-2 text-sm font-bold text-white shadow-[3px_3px_0_#27352f] hover:bg-[#d97865]"
            onClick={() => navigate("/add-expense")}
        >
            Add expense
        </Button>
        </div>
        </div>

        <div className="flex items-center gap-3">
        <Button
            aria-label="User profile"
            size="icon"
            className="h-10 w-10 rounded-full bg-[#f8d66d] text-sm font-black text-[#27352f] shadow-[2px_2px_0_#9ed9c2] hover:bg-[#f4ce59]"
            onClick={() => navigate("/profile")}
        >
            JD
        </Button>
        </div>
    </header>
    );
}