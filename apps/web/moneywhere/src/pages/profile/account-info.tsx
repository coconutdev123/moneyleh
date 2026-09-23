import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CalendarDays, Check, ImagePlus, Mail, Save, Trash2, Upload, UserRound } from "lucide-react";
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
    pfp: string;
};

const emptyForm: ProfileForm = {
    username: "",
    email: "",
    gender: "",
    dob: "",
    pfp: "",
};
    const navigate = useNavigate();
    const profile = useQuery(api.profile.getProfile);
    const ensureProfile = useMutation(api.profile.ensureProfile);
    const updateProfile = useMutation(api.profile.update);
    const [form, setForm] = useState<ProfileForm>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);
    const [imageSrc, setImageSrc] = useState("");
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ pointerX: 0, pointerY: 0, offsetX: 0, offsetY: 0 });
    const fileInput = useRef<HTMLInputElement>(null);

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
                pfp: profile.pfp || "",
            });
            setImageSrc(profile.pfp || "");
        }
    }, [ensureProfile, profile]);

    const updateField = (field: keyof ProfileForm, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(String(reader.result));
            setZoom(1);
            setOffset({ x: 0, y: 0 });
        };
        reader.readAsDataURL(file);
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!imageSrc) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragStart.current = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            offsetX: offset.x,
            offsetY: offset.y,
        };
        setIsDragging(true);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        setOffset({
            x: dragStart.current.offsetX + event.clientX - dragStart.current.pointerX,
            y: dragStart.current.offsetY + event.clientY - dragStart.current.pointerY,
        });
    };

    const handlePointerUp = () => setIsDragging(false);

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        if (!imageSrc) return;
        event.preventDefault();
        setZoom((current) => Math.min(3, Math.max(1, current - event.deltaY * 0.001)));
    };

    const deletePhoto = () => {
        setImageSrc("");
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        if (fileInput.current) fileInput.current.value = "";
    };

    const getCroppedPhoto = async () => {
        if (!imageSrc) return "";
        const image = new Image();
        image.src = imageSrc;
        await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject(new Error("Unable to load image"));
        });

        const size = 256;
        const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight) * zoom;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Unable to prepare image");
        context.fillStyle = "#f8f6f0";
        context.fillRect(0, 0, size, size);
        context.drawImage(image, (size - image.naturalWidth * scale) / 2 + offset.x, (size - image.naturalHeight * scale) / 2 + offset.y, image.naturalWidth * scale, image.naturalHeight * scale);
        return canvas.toDataURL("image/jpeg", 0.86);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!profile) return;

        setIsSaving(true);
        try {
            await updateProfile({ id: profile._id, updates: { ...form, pfp: await getCroppedPhoto() } });
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
                        <p className="mt-3 max-w-lg text-sm leading-6 text-[#75837b]">Keep your profile details updated so your moneyleh experience feels fresh.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="mb-2 block text-sm font-bold">Username</label>
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

                            <div className="sm:col-span-2">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label className="text-sm font-bold">Profile picture</label>
                                    {imageSrc && <button type="button" onClick={deletePhoto} disabled={isSaving} className="inline-flex items-center gap-1 text-xs font-bold text-[#bf624f] hover:underline"><Trash2 size={14} /> Delete photo</button>}
                                </div>
                                <div className="flex flex-col gap-4 rounded-2xl border border-[#dce6dc] bg-[#fdfcf8] p-4 sm:flex-row sm:items-center">
                                    <div onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onWheel={handleWheel} className={`relative h-40 w-40 shrink-0 touch-none overflow-hidden rounded-[22px] bg-[#fff8dd] ${imageSrc ? "cursor-grab" : ""} ${isDragging ? "cursor-grabbing" : ""}`}>
                                        {imageSrc ? <img src={imageSrc} alt="Profile preview" draggable={false} className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full object-cover" style={{ transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})` }} /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[#806b32]"><ImagePlus size={24} /><span className="text-xs font-bold">No photo yet</span></div>}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold">Make it yours</p>
                                        <p className="mt-1 text-xs leading-5 text-[#829087]">Upload a square-friendly image, then drag it to pan and use your mouse wheel to zoom.</p>
                                        <input ref={fileInput} id="pfp" type="file" accept="image/*" onChange={handleImageUpload} disabled={isLoading || isSaving} className="sr-only" />
                                        <label htmlFor="pfp" className="mt-4 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#9ed9c2] px-4 text-xs font-black text-[#27352f] transition hover:bg-[#82c8ae]"><Upload size={15} /> Choose photo</label>
                                    </div>
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