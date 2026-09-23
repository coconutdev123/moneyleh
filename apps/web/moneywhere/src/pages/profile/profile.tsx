import { Bell, ChevronRight, CreditCard, LockKeyhole, Mail, Pencil, ShieldCheck, UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@web_backend/convex/_generated/api";
import Header from "../../components/Header";

const preferences = [
	{ label: "Weekly money check-in", detail: "A gentle summary every Sunday", enabled: true },
	{ label: "Budget nudges", detail: "Let me know when I’m close to a limit", enabled: true },
	{ label: "Product updates", detail: "Occasional notes about new features", enabled: false },
];

export default function Profile() {
	const [notifications, setNotifications] = useState(preferences);
    const profile = useQuery(api.profile.getProfile);
    const ensureProfile = useMutation(api.profile.ensureProfile);
    const toggleNotification = (label: string) => {
		setNotifications((current) => current.map((item) => item.label === label ? { ...item, enabled: !item.enabled } : item));
	};

    useEffect(() => {
        if (profile === null){
            ensureProfile();
        }
    }, [profile, ensureProfile]);

	const getInitials = (name?: string) => {
		const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
		if (parts.length === 0) return "U";
		if (parts.length === 1) return parts[0][0].toUpperCase();
		return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    };

    const displayName = profile?.username?.trim() || "Jamie Davis";
    const displayEmail = profile?.email?.trim() || "No email added yet";
    const displayUsername = profile?.username?.trim() ? `@${profile.username.trim().toLowerCase().replace(/\s+/g, "")}` : "Add a username";

	return (
		<main className="min-h-screen overflow-hidden bg-[#f8f6f0] px-4 py-5 text-[#27352f] sm:px-6 lg:px-8">
			<div className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-96 
                            bg-[radial-gradient(circle_at_85%_0%,rgba(169,199,245,0.34),
                            transparent_36%),radial-gradient(circle_at_10%_10%,rgba(158,217,194,0.26),transparent_30%)]" />
			    <div className="relative z-10 mx-auto max-w-6xl">
				    <Header />

				<section className="pb-8 pt-9">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#e88976]">
                        Your moneyleh ~~~
                    </p>
                    <h1 className="text-3xl font-black tracking-[-0.07em] sm:text-4xl">Profile & preferences</h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#75837b]">Keep your details current and shape the way your money check-ins feel.</p>
                </section>

				<div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
					<div className="space-y-6">
						<section className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-6 shadow-[0_12px_30px_rgba(39,53,47,0.04)]">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-4">
										<div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[22px] bg-[#f8d66d] text-xl font-black text-[#27352f] shadow-[4px_4px_0_#9ed9c2]">
											{profile?.pfp ? <img src={profile.pfp} alt={`${displayName} profile`} className="h-full w-full object-cover" /> : getInitials(displayName)}
										</div>
								<div>
                                    <h2 className="text-xl font-black tracking-[-0.05em]">{displayName}</h2>
                                            <p className="mt-1 text-sm text-[#75837b]">Thoughtful spender since May 2026</p>
                                        </div>
                                        </div>
                                            <button type="button" aria-label="Edit profile photo" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf7ed] text-[#4e7460] transition-colors hover:bg-[#9ed9c2]"><Pencil size={15} /></button>
                                        </div>
                                    <div className="mt-7 space-y-3">
                                        <div className="flex items-center gap-3 rounded-2xl bg-[#f8f6f0] px-4 py-3"><Mail size={16} className="text-[#e88976]" />
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9aaa9f]">Email</p>
                                            <p className="mt-0.5 text-sm font-bold">{displayEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-2xl bg-[#f8f6f0] px-4 py-3"><UserRound size={16} className="text-[#4e7460]" /><div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9aaa9f]">Username</p><p className="mt-0.5 text-sm font-bold">{displayUsername}</p>
                                    </div>
                                </div>
                            </div>
                            <Link to="/account-info" className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#27352f] text-sm font-bold text-white shadow-[3px_3px_0_#f8d66d] transition-transform hover:-translate-y-0.5">
                                <Pencil size={16} />
                                <span>Edit profile details</span>
                            </Link>
						</section>

						<section className="rounded-[28px] border border-[#dce6dc] bg-[#edf7ed] p-6"><div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#4e7460]"><ShieldCheck size={20} /></span><div><h2 className="font-black tracking-[-0.03em]">Your account is cozy</h2><p className="mt-1 text-sm leading-6 text-[#627069]">Your profile and money data are protected with secure sign-in.</p></div></div><button type="button" className="mt-5 inline-flex items-center gap-1 text-xs font-black text-[#4e7460] hover:underline">Review security <ChevronRight size={14} /></button></section>
					</div>

					<div className="space-y-6">
						<section className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-6 shadow-[0_12px_30px_rgba(39,53,47,0.04)]">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-black tracking-[-0.04em]">Preferences</h2>
                                    <p className="mt-1 text-sm text-[#829087]">Choose what makes your dashboard useful.</p>
                                </div>
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff8dd] text-[#806b32]"><Bell size={19} /></span>
                            </div>
                            <div className="divide-y divide-[#edf0ea]">{notifications.map((item) => 
                                <div key={item.label} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f8f6f0] text-[#e88976]">
                                        <Bell size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold">{item.label}</p>
                                        <p className="mt-1 text-xs text-[#829087]">{item.detail}</p>
                                    </div>
                                    <button type="button" role="switch" aria-checked={item.enabled} aria-label={`Toggle ${item.label}`} onClick={() => toggleNotification(item.label)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${item.enabled ? "bg-[#9ed9c2]" : "bg-[#dce6dc]"}`}>
                                        <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.enabled ? "translate-x-5" : "translate-x-0"}`} />
                                    </button>
                                </div>)}
                            </div>
                        </section>
						<section className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-6 shadow-[0_12px_30px_rgba(39,53,47,0.04)]">
                            <h2 className="text-lg font-black tracking-[-0.04em]">Account settings</h2>
                                <div className="mt-5 space-y-2">
                                    <button type="button" className="flex w-full items-center gap-3 rounded-2xl border border-[#edf0ea] bg-[#fdfcf8] px-4 py-3 text-left transition-colors hover:bg-[#f8f6f0]">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#a9c7f5] text-[#27352f]"><LockKeyhole size={16} /></span>
                                        <span className="flex-1"><span className="block text-sm font-bold">Password & sign-in</span>
                                        <span className="mt-1 block text-xs text-[#829087]">Update your password or connected accounts</span>
                                        </span><ChevronRight size={17} className="text-[#9aaa9f]" />
                                    </button>
                                    <button type="button" className="flex w-full items-center gap-3 rounded-2xl border border-[#edf0ea] bg-[#fdfcf8] px-4 py-3 text-left transition-colors hover:bg-[#f8f6f0]">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8d66d] text-[#27352f]"><CreditCard size={16} /></span>
                                        <span className="flex-1">
                                            <span className="block text-sm font-bold">Connected accounts</span>
                                            <span className="mt-1 block text-xs text-[#829087]">Manage linked financial accounts</span>
                                        </span>
                                        <ChevronRight size={17} className="text-[#9aaa9f]" />
                                    </button>
                                </div>
                        </section>
					</div>
				</div>
			</div>
		</main>
	);
}
