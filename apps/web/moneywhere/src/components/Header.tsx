
import { Button } from "@shared/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Header() {

    const navigate = useNavigate();

    return (
    <header className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2">
        <Button
            variant= "ghost"
            size="sm"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            onClick={() => navigate("/dashboard")}
        >
            Dashboard
        </Button>
        <Button
            variant="ghost"
            size="sm"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            onClick={() => navigate("/overview")}
        >
            Overview
        </Button>
        <Button
            size="sm"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
            onClick={() => navigate("/add-expense")}
        >
            Add expense
        </Button>
        </div>

        <div className="flex items-center gap-3">
        <Button
            aria-label="User profile"
            size="icon"
            className="h-11 w-11 rounded-full bg-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-300"
            onClick={() => navigate("/profile")}
        >
            JD
        </Button>
        </div>
    </header>
    );
}