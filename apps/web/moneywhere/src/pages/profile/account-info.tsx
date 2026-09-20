import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Check, Mail, Save, UserRound } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@web_backend/convex/_generated/api";

export default function AccountInfo() {

type ProfileForm = {
    username: string;
    email: string;
    gender: string;
    dob: string;
};

const emptyForm: ProfileForm = {
    username: "",
    email: "",
    gender: "",
    dob: "",
};
    const navigate = useNavigate();
    const profile = useQuery(api.profile.getProfile);
    const ensureProfile = useMutation(api.profile.ensureProfile);
    const updateProfile = useMutation(api.profile.update);
    const [form, setForm] = useState<ProfileForm>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (profile === null) {
            void ensureProfile();
            return;
        }

        if (profile) {
            setForm({
                username: profile.username,
                email: profile.email,
                gender: profile.gender,
                dob: profile.dob,
            });
        }
    }, [ensureProfile, profile]);

    const updateField = (field: keyof ProfileForm, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!profile) return;

        setIsSaving(true);
        try {
            await updateProfile({ id: profile._id, updates: form });
            toast.success("Your account details are up to date.");
            navigate("/profile");
        } catch {
            toast.error("We couldn't save your details. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const isLoading = profile === undefined || profile === null;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f8f6f0] px-4 py-5 text-[#27352f] sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(158,217,194,0.35),transparent_24%),radial-gradient(circle_at_90%_80%,rgba(169,199,245,0.36),transparent_28%)]" />
            <div className="pointer-events-none absolute -left-20 top-20 h-40 w-40 rounded-full bg-[#f8d66d]/35 blur-2xl" />
            <div className="pointer-events-none absolute -right-16 top-8 h-44 w-44 rounded-full bg-[#e88976]/20 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-2xl py-5 sm:py-10">
                <Link to="/profile" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#4e7460] hover:text-[#27352f]">
                    <ArrowLeft size={16} /> Back to profile
                </Link>

                <section className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-6 shadow-[10px_14px_0_rgba(169,199,245,0.25)] backdrop-blur-sm sm:p-8">
                    <div className="mb-8">
                        <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#e88976]">Your details</p>
                        <h1 className="text-3xl font-black tracking-[-0.06em]">Account information</h1>
                        <p className="mt-3 max-w-lg text-sm leading-6 text-[#75837b]">Keep your profile details current so your moneyleh experience feels like yours.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="mb-2 block text-sm font-bold">Full name</label>
                            <div className="relative">
                                <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4e7460]" size={17} />
                                <input id="username" value={form.username} onChange={(event) => updateField("username", event.target.value)} disabled={isLoading || isSaving} required placeholder="Jamie Davis" className="h-12 w-full rounded-2xl border border-[#dce6dc] bg-[#fdfcf8] pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#9ed9c2] focus:ring-4 focus:ring-[#9ed9c2]/25 disabled:opacity-60" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-bold">Email address</label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#e88976]" size={17} />
                                <input id="email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} disabled={isLoading || isSaving} required placeholder="you@example.com" className="h-12 w-full rounded-2xl border border-[#dce6dc] bg-[#fdfcf8] pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#9ed9c2] focus:ring-4 focus:ring-[#9ed9c2]/25 disabled:opacity-60" />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="gender" className="mb-2 block text-sm font-bold">Gender</label>
                                <select id="gender" value={form.gender} onChange={(event) => updateField("gender", event.target.value)} disabled={isLoading || isSaving} className="h-12 w-full rounded-2xl border border-[#dce6dc] bg-[#fdfcf8] px-4 text-sm font-semibold outline-none transition focus:border-[#9ed9c2] focus:ring-4 focus:ring-[#9ed9c2]/25 disabled:opacity-60">
                                    <option value="">Prefer not to say</option>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                    <option value="non-binary">Non-binary</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="dob" className="mb-2 block text-sm font-bold">Date of birth</label>
                                <div className="relative">
                                    <CalendarDays className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#806b32]" size={17} />
                                    <input id="dob" type="date" value={form.dob} onChange={(event) => updateField("dob", event.target.value)} disabled={isLoading || isSaving} className="h-12 w-full rounded-2xl border border-[#dce6dc] bg-[#fdfcf8] pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#9ed9c2] focus:ring-4 focus:ring-[#9ed9c2]/25 disabled:opacity-60" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-[#edf0ea] pt-6 sm:flex-row sm:justify-end">
                            <button type="button" onClick={() => navigate("/profile")} className="h-11 rounded-xl px-5 text-sm font-bold text-[#627069] transition hover:bg-[#f8f6f0]">Cancel</button>
                            <button type="submit" disabled={isLoading || isSaving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#27352f] px-5 text-sm font-bold text-white shadow-[3px_3px_0_#f8d66d] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
                                {isSaving ? <><Check size={16} /> Saving...</> : <><Save size={16} /> Save changes</>}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}