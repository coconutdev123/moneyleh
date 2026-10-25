import { useState, type DragEvent, type FormEvent } from "react";
import { CalendarDays, ExternalLink, GripVertical, History, Info, Link2, Plus, Sparkles, Target, Trash2, Wallet } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@web_backend/convex/_generated/api";
import type { Id } from "@web_backend/convex/_generated/dataModel";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import Header from "../../components/Header";

type WishlistId = Id<"wishlist">;

type WishlistForm = {
	title: string;
	item: string;
	price: string;
	projectedDate: string;
	link: string;
};

const emptyForm: WishlistForm = {
	title: "",
	item: "",
	price: "",
	projectedDate: "",
	link: "",
};

const priorityNoticeId = "wishlist-priority-notice";

function formatMoney(amount: number) {
	return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function daysUntil(date: string) {
	const difference = new Date(`${date}T23:59:59`).getTime() - Date.now();
	return Math.max(0, Math.ceil(difference / 86_400_000));
}

export default function Wishlist() {
	const wishlists = useQuery(api.wishlist.getWishlists);
	const createWishlist = useMutation(api.wishlist.createWishlist);
	const addSavings = useMutation(api.wishlist.addSavings);
	const reorderWishlists = useMutation(api.wishlist.reorderWishlists);
	const removeWishlist = useMutation(api.wishlist.removeWishlist);

	const [isAdding, setIsAdding] = useState(false);
	const [form, setForm] = useState(emptyForm);
	const [savingId, setSavingId] = useState<WishlistId | null>(null);
	const [savingsInputs, setSavingsInputs] = useState<Record<string, string>>({});
	const [draggedId, setDraggedId] = useState<WishlistId | null>(null);
	const [error, setError] = useState("");
	const [isPriorityNoticeOpen, setIsPriorityNoticeOpen] = useState(false);

	const fieldClass = "h-11 rounded-xl border-[#dce6dc] bg-[#f8f6f0] px-3 shadow-none placeholder:text-[#9aaa9f] focus-visible:border-[#9ed9c2] focus-visible:ring-[#9ed9c2]/30";
	const numberFieldClass = `${fieldClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

	const updateForm = (field: keyof WishlistForm, value: string) => {
		setForm((current) => ({ ...current, [field]: value }));
	};

	const togglePriorityNotice = () => {
		if (isPriorityNoticeOpen) {
			toast.dismiss(priorityNoticeId);
			setIsPriorityNoticeOpen(false);
			return;
		}

		toast.info("If you switch wishlist priorities, manually input the amount saved from wishlist A into wishlist B.", {
			id: priorityNoticeId,
			duration: 5000,
			closeButton: false,
		});
		setIsPriorityNoticeOpen(true);
	};

	const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");

		const price = Number(form.price);
		try {
			new URL(form.link);
		} catch {
			setError("Paste a valid product link, including https://.");
			return;
		}

		if (!form.title.trim() || !form.item.trim() || !form.projectedDate || !Number.isFinite(price) || price <= 0) {
			setError("Add a name, item, target amount, and end date first.");
			return;
		}

		try {
			await createWishlist({
				title: form.title.trim(),
				item: form.item.trim(),
				price,
				projectedDate: form.projectedDate,
				link: form.link.trim(),
			});
			setForm(emptyForm);
			setIsAdding(false);
			toast.success("Wishlist added.");
		} catch {
			setError("We couldn't add this wishlist. Please try again.");
		}
	};

	const handleAddSavings = async (id: WishlistId) => {
		const value = savingsInputs[id] ?? "";
		const amount = Number(value);
		if (!Number.isFinite(amount) || amount <= 0) {
			toast.error("Enter a savings amount greater than zero.");
			return;
		}

		setSavingId(id);
		try {
			await addSavings({ wishlistId: id, amount, savedAt: new Date().toISOString() });
			setSavingsInputs((current) => ({ ...current, [id]: "" }));
			toast.success(`${formatMoney(amount)} added to your savings.`);
		} catch {
			toast.error("We couldn't record your savings.");
		} finally {
			setSavingId(null);
		}
	};

	const handleDrop = async (event: DragEvent<HTMLElement>, targetId: WishlistId) => {
		event.preventDefault();
		if (!draggedId || draggedId === targetId || !wishlists) return;

		const reordered = [...wishlists];
		const fromIndex = reordered.findIndex((wishlist) => wishlist._id === draggedId);
		const toIndex = reordered.findIndex((wishlist) => wishlist._id === targetId);
		if (fromIndex < 0 || toIndex < 0) return;

		const [moved] = reordered.splice(fromIndex, 1);
		reordered.splice(toIndex, 0, moved);
		setDraggedId(null);

		try {
			await reorderWishlists({ orderedIds: reordered.map((wishlist) => wishlist._id) });
		} catch {
			toast.error("We couldn't update the wishlist order.");
		}
	};

	const handleDelete = async (id: WishlistId) => {
		try {
			await removeWishlist({ id });
			toast.success("Wishlist removed.");
		} catch {
			toast.error("We couldn't remove this wishlist.");
		}
	};

	return (
		<main className="min-h-screen overflow-hidden bg-[#f8f6f0] px-4 py-5 text-[#27352f] sm:px-6 lg:px-8">
			<div className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(circle_at_85%_0%,rgba(169,199,245,0.34),transparent_36%),radial-gradient(circle_at_10%_10%,rgba(158,217,194,0.26),transparent_30%)]" />
			<div className="relative z-10 mx-auto max-w-7xl">
				<Header />

				<section className="flex flex-col gap-5 pb-7 pt-9 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#e88976]">Save toward something lovely</p>
						<div className="flex items-center gap-2">
							<h1 className="text-3xl font-black tracking-[-0.07em] sm:text-4xl">Your wishlists</h1>
							<button type="button" onClick={togglePriorityNotice} aria-label="Show priority savings reminder" aria-pressed={isPriorityNoticeOpen} title="Priority savings reminder" className="shrink-0 rounded-full p-1 text-[#829087] transition-colors hover:bg-[#edf7ed] hover:text-[#4e7460] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9ed9c2]">
								<Info size={17} />
							</button>
						</div>
						<p className="mt-2 max-w-xl text-sm leading-6 text-[#75837b]">Keep your next purchases visible, give each one a finish line, and move your priority to the front.</p>
					</div>
					<Button onClick={() => { setIsAdding((current) => !current); setError(""); }} className="h-11 rounded-xl bg-[#e88976] px-4 font-bold text-white shadow-[3px_3px_0_#27352f] hover:bg-[#d97865]">
						<Plus size={17} /> {isAdding ? "Close form" : "New wishlist"}
					</Button>
				</section>

				{isAdding && (
					<form onSubmit={handleCreate} className="mb-6 rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6">
						<div className="mb-5 flex items-start justify-between gap-4">
							<div>
								<p className="text-xs font-black uppercase tracking-[0.14em] text-[#4e7460]">New goal</p>
								<h2 className="mt-1 text-xl font-black tracking-[-0.05em]">What are you saving for?</h2>
							</div>
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff8dd] text-[#806b32]"><Target size={19} /></span>
						</div>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
							<Input required value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Wishlist name" className={fieldClass} />
							<Input required value={form.item} onChange={(event) => updateForm("item", event.target.value)} placeholder="Item name" className={fieldClass} />
							<Input required type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => updateForm("price", event.target.value)} placeholder="Target amount" className={numberFieldClass} />
							<Input required type="date" value={form.projectedDate} onChange={(event) => updateForm("projectedDate", event.target.value)} className={fieldClass} />
							<div className="relative">
								<Link2 size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aaa9f]" />
								<Input required type="url" value={form.link} onChange={(event) => updateForm("link", event.target.value)} placeholder="Product link" className={`${fieldClass} pl-9`} />
							</div>
						</div>
						{error && <p className="mt-3 rounded-xl bg-[#fff0ec] px-3 py-2 text-sm font-semibold text-[#bf624f]">{error}</p>}
						<div className="mt-5 flex justify-end">
							<Button type="submit" className="h-11 rounded-xl bg-[#27352f] px-5 font-bold text-white shadow-[3px_3px_0_#f8d66d] hover:bg-[#34483f]">Save wishlist</Button>
						</div>
					</form>
				)}

				{wishlists === undefined ? (
					<div className="rounded-[28px] border border-[#dce6dc] bg-white/80 p-10 text-center text-sm font-semibold text-[#829087]">Loading your wishlists...</div>
				) : wishlists.length === 0 ? (
					<div className="rounded-[28px] border border-dashed border-[#b9cbbd] bg-white/60 px-6 py-16 text-center">
						<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf7ed] text-[#4e7460]"><Sparkles size={24} /></div>
						<h2 className="mt-4 text-xl font-black">Nothing on the horizon yet</h2>
						<p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#829087]">Add something you want, then turn small daily savings into a visible plan.</p>
					</div>
				) : (
					<section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
						{wishlists.map((wishlist, index) => {
							const savedAmount = wishlist.savedAmount ?? 0;
							const progress = Math.min(100, Math.round((savedAmount / wishlist.price) * 100));
							const remaining = Math.max(0, wishlist.price - savedAmount);
							return (
								<article key={wishlist._id} draggable onDragStart={() => setDraggedId(wishlist._id)} onDragEnd={() => setDraggedId(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => void handleDrop(event, wishlist._id)} className={`rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] transition-transform ${draggedId === wishlist._id ? "scale-[0.98] opacity-60" : "hover:-translate-y-0.5"}`}>
									<div className="flex items-start gap-3">
										<button type="button" aria-label={`Drag ${wishlist.title} to change priority`} className="mt-1 cursor-grab text-[#9aaa9f] active:cursor-grabbing"><GripVertical size={18} /></button>
										<div className="min-w-0 flex-1">
											<div className="flex items-start justify-between gap-3">
												<div>
													<p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#e88976]">Priority {index + 1}</p>
													<h2 className="mt-1 truncate text-xl font-black tracking-[-0.05em]">{wishlist.title}</h2>
												</div>
												<button type="button" aria-label={`Delete ${wishlist.title}`} onClick={() => void handleDelete(wishlist._id)} className="rounded-lg p-1.5 text-[#9aaa9f] hover:bg-[#fff0ec] hover:text-[#bf624f]"><Trash2 size={16} /></button>
											</div>
											<p className="mt-1 truncate text-sm font-semibold text-[#627069]">{wishlist.item}</p>
										</div>
									</div>

									<div className="mt-5 flex items-center justify-between rounded-2xl bg-[#f8f6f0] px-4 py-3">
										<div className="flex items-center gap-2 text-xs font-bold text-[#627069]"><CalendarDays size={15} className="text-[#e88976]" /> {daysUntil(wishlist.projectedDate)} days left</div>
										<a href={wishlist.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-black text-[#4e7460] hover:underline">View item <ExternalLink size={13} /></a>
									</div>

									<div className="mt-5 flex items-end justify-between gap-3">
										<div><p className="text-xs font-bold text-[#829087]">Saved so far</p><p className="mt-1 text-2xl font-black tracking-[-0.06em]">{formatMoney(savedAmount)}</p></div>
										<p className="text-right text-sm font-black text-[#4e7460]">{progress}%<span className="block text-[11px] font-semibold text-[#829087]">of {formatMoney(wishlist.price)}</span></p>
									</div>
									<div className="mt-4 h-3 overflow-hidden rounded-full bg-[#edf0ea]"><div className="h-full rounded-full bg-[#9ed9c2] transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>

									<div className="mt-5 border-t border-[#edf0ea] pt-4">
										<div className="flex items-center justify-between gap-3">
											<label htmlFor={`saved-${wishlist._id}`} className="text-xs font-bold text-[#627069]">Add today&apos;s savings</label>
											<span className="text-xs font-semibold text-[#829087]">{formatMoney(remaining)} left</span>
										</div>
										<div className="mt-2 flex gap-2">
											<div className="relative min-w-0 flex-1"><Wallet size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aaa9f]" /><Input id={`saved-${wishlist._id}`} type="number" min="0.01" step="0.01" value={savingsInputs[wishlist._id] ?? ""} onChange={(event) => setSavingsInputs((current) => ({ ...current, [wishlist._id]: event.target.value }))} placeholder="How much did you save?" className={`${numberFieldClass} pl-9`} /></div>
											<Button type="button" disabled={savingId === wishlist._id} onClick={() => void handleAddSavings(wishlist._id)} className="h-11 rounded-xl bg-[#4e7460] px-4 font-bold text-white hover:bg-[#3d604d]">Add</Button>
										</div>
										{savingId === wishlist._id && <p className="mt-2 text-xs font-semibold text-[#829087]">Saving contribution...</p>}
									</div>

									{wishlist.savings.length > 0 && (
										<div className="mt-4 rounded-2xl bg-[#f8f6f0] p-3">
											<div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-[#829087]"><History size={14} /> Savings history</div>
											<div className="mt-2 space-y-1.5">
												{wishlist.savings.slice(0, 3).map((saving) => <div key={saving._id} className="flex justify-between text-xs font-semibold text-[#627069]"><span>{new Date(saving.savedAt).toLocaleDateString()}</span><span className="text-[#4e7460]">+{formatMoney(saving.amount)}</span></div>)}
											</div>
										</div>
									)}
								</article>
							);
						})}
					</section>
				)}
			</div>
		</main>
	);
}
