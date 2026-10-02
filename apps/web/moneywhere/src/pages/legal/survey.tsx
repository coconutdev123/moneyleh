import { useEffect, useState, type FormEvent } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ArrowRight, CalendarDays, DollarSign, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@web_backend/convex/_generated/api";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";

export default function Survey() {
	const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
	const profile = useQuery(api.profile.getProfile, isAuthenticated ? {} : "skip");
	const completeOnboarding = useMutation(api.profile.completeOnboarding);
	const navigate = useNavigate();
	const [dob, setDob] = useState("");
	const [monthlyIncome, setMonthlyIncome] = useState("");
	const [error, setError] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (!isAuthLoading && !isAuthenticated) {
			navigate("/sign-in", { replace: true });
			return;
		}
		if (profile && profile.onboardingCompleted !== false) {
			navigate("/dashboard", { replace: true });
		}
	}, [isAuthLoading, isAuthenticated, navigate, profile]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");
		const income = Number(monthlyIncome);
		if (!dob || !Number.isFinite(income) || income < 0) {
			setError("Enter your date of birth and a valid monthly income.");
			return;
		}
		setIsSaving(true);
		try {
			await completeOnboarding({ dob, monthlyIncome: income });
			toast.success("Your preferences are ready.");
			navigate("/dashboard", { replace: true });
		} catch {
			setError("We couldn't save your answers. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	if (isAuthLoading || !isAuthenticated || profile === undefined || !profile || profile.onboardingCompleted !== false) {
		return <main className="flex min-h-screen items-center justify-center bg-[#f8f6f0] px-4 text-sm font-semibold text-[#75837b]">Preparing your account...</main>;
	}

	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f6f0] px-4 py-10 text-[#27352f] sm:px-6">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(158,217,194,0.35),transparent_24%),radial-gradient(circle_at_90%_80%,rgba(169,199,245,0.36),transparent_28%)]" />
			<section className="relative z-10 w-full max-w-xl rounded-[28px] border border-[#dce6dc] bg-white/90 p-6 shadow-[10px_14px_0_rgba(169,199,245,0.25)] backdrop-blur-sm sm:p-9">
				<p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#e88976]">A more personal money space</p>
				<h1 className="text-3xl font-black tracking-[-0.06em] sm:text-4xl">A couple of details</h1>
				<p className="mt-3 text-sm leading-6 text-[#75837b]">These help us tailor your moneyleh experience to you.</p>

				<form onSubmit={handleSubmit} className="mt-7 space-y-5">
					<div>
						<label htmlFor="survey-dob" className="mb-2 block text-sm font-bold">Date of birth</label>
						<div className="relative">
							<CalendarDays size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4e7460]" />
							<Input id="survey-dob" type="date" required max={new Date().toISOString().slice(0, 10)} value={dob} onChange={(event) => setDob(event.target.value)} disabled={isSaving} className="h-12 rounded-xl border-[#dce6dc] bg-[#f8f6f0] pl-11 shadow-none focus-visible:border-[#9ed9c2] focus-visible:ring-[#9ed9c2]/30" />
						</div>
					</div>
					<div>
						<label htmlFor="survey-income" className="mb-2 block text-sm font-bold">Monthly income (HKD)</label>
						<div className="relative">
							<DollarSign size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4e7460]" />
							<Input id="survey-income" type="number" min="0" step="0.01" required inputMode="decimal" placeholder="0.00" value={monthlyIncome} onChange={(event) => setMonthlyIncome(event.target.value)} disabled={isSaving} className="h-12 rounded-xl border-[#dce6dc] bg-[#f8f6f0] pl-11 shadow-none [appearance:textfield] focus-visible:border-[#9ed9c2] focus-visible:ring-[#9ed9c2]/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
						</div>
					</div>

					<div className="flex gap-3 rounded-2xl border border-[#dce6dc] bg-[#edf7ed] p-4">
						<ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#4e7460]" />
						<p className="text-xs leading-5 text-[#4d6357]">Your date of birth and monthly income will only be used to personalize your experience within moneyleh. We will not use this information for other purposes.</p>
					</div>

					{error && <p role="alert" className="rounded-xl bg-[#fff0ec] px-4 py-3 text-sm font-semibold text-[#bf624f]">{error}</p>}
					<Button type="submit" disabled={isSaving} className="h-12 w-full rounded-xl bg-[#27352f] font-bold text-white shadow-[3px_3px_0_#f8d66d] hover:bg-[#34483f]">
						{isSaving ? "Saving your preferences..." : <>Continue <ArrowRight size={16} /></>}
					</Button>
				</form>
			</section>
		</main>
	);
}
