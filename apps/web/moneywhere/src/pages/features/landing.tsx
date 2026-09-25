import { ArrowRight, Check, ChevronDown, CircleHelp, Leaf, Menu, Play, Sparkles, Star, TrendingUp, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const spending = [
	{ label: "Home", amount: "$920", color: "bg-[#ff9e8e]", width: "w-[76%]" },
	{ label: "Food & coffee", amount: "$438", color: "bg-[#9ed9c2]", width: "w-[46%]" },
	{ label: "Transport", amount: "$182", color: "bg-[#a9c7f5]", width: "w-[22%]" },
];

function Logo() {
	return (
		<Link to="/" className="flex items-center gap-2.5 text-[#27352f]" aria-label="Moneyleh home">
			<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#27352f] text-[#f8d66d] shadow-[3px_3px_0_#9ed9c2]">
				<Leaf size={19} strokeWidth={2.5} />
			</span>
			<span className="text-lg font-bold tracking-[-0.04em]">moneyleh</span>
		</Link>
	);
}

export default function Landing() {
	return (
		<main className="min-h-screen overflow-hidden bg-[#f8f6f0] text-[#27352f] selection:bg-[#f8d66d] selection:text-[#27352f]">
			<div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[760px] bg-[radial-gradient(circle_at_75%_20%,rgba(169,199,245,0.34),transparent_29%),radial-gradient(circle_at_15%_38%,rgba(158,217,194,0.27),transparent_28%)]" />
			<nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
				<Logo />
				<div className="hidden items-center gap-8 text-sm font-semibold text-[#627069] md:flex">
					<a href="#how-it-works" className="transition-colors hover:text-[#27352f]">How it works</a>
					<a href="#features" className="transition-colors hover:text-[#27352f]">Features</a>
					<a href="#stories" className="transition-colors hover:text-[#27352f]">Stories</a>
				</div>
				<div className="hidden items-center gap-3 md:flex">
					<Link to="/sign-in" className="px-4 py-2 text-sm font-bold text-[#627069] transition-colors hover:text-[#27352f]">Log in</Link>
					<Link to="/sign-up" className="rounded-full bg-[#27352f] px-5 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0_#f8d66d] transition-transform hover:-translate-y-0.5">Start free</Link>
				</div>
				<button type="button" className="rounded-full border border-[#dbe2d8] bg-white/70 p-2.5 md:hidden" aria-label="Open navigation menu">
					<Menu size={20} />
				</button>
			</nav>

			<section className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-12 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:pb-28 lg:pt-20">
				<div className="max-w-xl">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d8e5d9] bg-[#edf7ed] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#4e7460]">
						<Sparkles size={14} /> Money clarity, made gentle
					</div>
					<h1 className="max-w-[600px] text-[clamp(3.5rem,7vw,6.5rem)] font-black leading-[0.91] tracking-[-0.08em] text-[#27352f]">
						Know where your money <span className="text-[#e88976]">grows.</span>
					</h1>
					<p className="mt-7 max-w-md text-lg leading-8 text-[#68776f]">
						A calm, colorful way to see your spending, build better habits, and make room for what matters next.
					</p>
					<div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
						<Link to="/sign-up" className="group inline-flex items-center gap-3 rounded-full bg-[#e88976] px-6 py-3.5 text-sm font-bold text-white shadow-[5px_5px_0_#27352f] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#27352f]">
							Make a free plan <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
						</Link>
						<a href="#how-it-works" className="group inline-flex items-center gap-2 px-3 py-2 text-sm font-bold text-[#627069]">
							<span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#cfdad1] bg-white text-[#e88976] transition-colors group-hover:bg-[#f8d66d]"><Play size={13} fill="currentColor" /></span>
							See how it works
						</a>
					</div>
					<div className="mt-9 flex items-center gap-3 text-xs font-semibold text-[#7a8981]">
						<div className="flex -space-x-2">
							{['#f2b8a4', '#a9c7f5', '#f8d66d', '#9ed9c2'].map((color) => <span key={color} className="h-7 w-7 rounded-full border-2 border-[#f8f6f0]" style={{ backgroundColor: color }} />)}
						</div>
						Loved by 12,000+ thoughtful spenders
					</div>
				</div>

				<div className="relative mx-auto w-full max-w-[570px]" aria-label="Moneywhere dashboard preview">
					<div className="absolute -left-7 top-16 hidden -rotate-6 rounded-2xl border border-[#dae4d8] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(39,53,47,0.09)] sm:block">
						<div className="flex items-center gap-2 text-xs font-bold text-[#627069]"><span className="h-2 w-2 rounded-full bg-[#9ed9c2]" /> On track this month</div>
					</div>
					<div className="absolute -right-4 bottom-10 hidden rotate-6 rounded-2xl border border-[#f0dca9] bg-[#fff8dd] px-4 py-3 shadow-[0_12px_30px_rgba(39,53,47,0.09)] sm:block">
						<div className="flex items-center gap-2 text-xs font-bold text-[#806b32]"><TrendingUp size={15} /> +18% saved</div>
					</div>
					<div className="rounded-[30px] border border-[#dbe4d8] bg-white/90 p-3 shadow-[16px_20px_0_rgba(169,199,245,0.22)] backdrop-blur-sm sm:p-5">
						<div className="flex items-center justify-between border-b border-[#edf0ea] pb-4">
							<div className="flex items-center gap-2 text-sm font-bold"><span className="h-2.5 w-2.5 rounded-full bg-[#e88976]" /> September overview</div>
							<button type="button" className="flex items-center gap-1 rounded-full bg-[#f5f7f2] px-3 py-1.5 text-xs font-bold text-[#697970]">This month <ChevronDown size={13} /></button>
						</div>
						<div className="grid gap-4 py-5 sm:grid-cols-[1.08fr_0.92fr]">
							<div className="rounded-2xl bg-[#edf7ed] p-5">
								<div className="flex items-start justify-between"><div><p className="text-xs font-bold text-[#70877a]">Available to spend</p><p className="mt-2 text-3xl font-black tracking-[-0.06em]">$2,846.20</p></div><div className="rounded-xl bg-white p-2 text-[#e88976]"><Wallet size={19} /></div></div>
								<div className="mt-8 flex items-end gap-1.5" aria-label="Spending trend chart"><span className="h-10 w-2 rounded-full bg-[#b9ddc8]" /><span className="h-16 w-2 rounded-full bg-[#b9ddc8]" /><span className="h-12 w-2 rounded-full bg-[#b9ddc8]" /><span className="h-24 w-2 rounded-full bg-[#e88976]" /><span className="h-20 w-2 rounded-full bg-[#b9ddc8]" /><span className="h-28 w-2 rounded-full bg-[#b9ddc8]" /><span className="h-16 w-2 rounded-full bg-[#b9ddc8]" /><span className="h-32 w-2 rounded-full bg-[#27352f]" /></div>
								<div className="mt-2 flex justify-between text-[10px] font-semibold text-[#7e9587]"><span>Sep 1</span><span>Sep 30</span></div>
							</div>
							<div className="rounded-2xl bg-[#fff8dd] p-5"><div className="flex items-center justify-between"><p className="text-xs font-bold text-[#8e7b43]">Monthly budget</p><CircleHelp size={15} className="text-[#b09c58]" /></div><p className="mt-2 text-3xl font-black tracking-[-0.06em]">$4,200</p><div className="mt-6 h-3 overflow-hidden rounded-full bg-[#f2e7b7]"><div className="h-full w-[68%] rounded-full bg-[#e88976]" /></div><div className="mt-2 flex justify-between text-[10px] font-bold text-[#9d8950]"><span>$2,846 spent</span><span>68%</span></div></div>
						</div>
						<div className="rounded-2xl border border-[#edf0ea] p-5"><div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-black">Where it goes</p><p className="mt-1 text-xs text-[#8a978f]">Your top categories this month</p></div><button type="button" className="text-xs font-bold text-[#e88976]">View all</button></div>{spending.map((item) => <div key={item.label} className="mb-4 last:mb-0"><div className="mb-1.5 flex justify-between text-xs font-bold"><span>{item.label}</span><span className="text-[#7d8d84]">{item.amount}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#f0f2ed]"><div className={`h-full ${item.width} ${item.color} rounded-full`} /></div></div>)}</div>
					</div>
				</div>
			</section>

			<section id="how-it-works" className="relative z-10 border-y border-[#e3e8df] bg-white/55 px-6 py-16 lg:px-8 lg:py-20">
				<div className="mx-auto max-w-6xl"><div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-black uppercase tracking-[0.15em] text-[#e88976]">A softer approach</p><h2 className="max-w-lg text-3xl font-black tracking-[-0.06em] sm:text-4xl">Small steps. A much clearer picture.</h2></div><p className="max-w-xs text-sm leading-6 text-[#75837b]">Money management should feel like support, not homework.</p></div><div id="features" className="grid gap-4 md:grid-cols-3">{[{ icon: <Wallet size={20} />, title: "Capture the everyday", body: "Add an expense in seconds and keep the little things from becoming a mystery." }, { icon: <TrendingUp size={20} />, title: "Spot your rhythm", body: "Simple visuals show where your money is moving, without making you do the math." }, { icon: <Star size={20} />, title: "Make room for more", body: "Set gentle goals that turn good intentions into a plan you can actually keep." }].map((item, index) => <article key={item.title} className="rounded-2xl border border-[#e2e9e0] bg-[#f8f6f0] p-6"><div className={`mb-8 flex h-10 w-10 items-center justify-center rounded-xl ${index === 0 ? 'bg-[#f8d66d]' : index === 1 ? 'bg-[#a9c7f5]' : 'bg-[#9ed9c2]'} text-[#27352f]`}>{item.icon}</div><h3 className="text-lg font-black tracking-[-0.03em]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#75837b]">{item.body}</p><div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#627069]"><Check size={14} className="text-[#e88976]" /> Built for real life</div></article>)}</div></div>
			</section>

			<section id="stories" className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24"><div className="grid gap-10 rounded-[30px] bg-[#27352f] px-7 py-10 text-white sm:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><p className="mb-3 text-xs font-black uppercase tracking-[0.15em] text-[#f8d66d]">A little more ease</p><h2 className="max-w-md text-3xl font-black leading-tight tracking-[-0.06em] sm:text-4xl">Your future self will thank you.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-[#b7c6bc]">Join thousands of people building a better relationship with their money, one clear choice at a time.</p></div><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end"><Link to="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f8d66d] px-6 py-3.5 text-sm font-black text-[#27352f] transition-transform hover:-translate-y-0.5">Get started free <ArrowRight size={17} /></Link><span className="flex items-center justify-center gap-2 text-xs font-semibold text-[#b7c6bc]"><Check size={15} className="text-[#9ed9c2]" /> No credit card needed</span></div></div></section>

		</main>
	);
}
