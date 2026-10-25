import { Leaf, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="border-t border-[#e3e8df] bg-[#f8f6f0] px-6 py-8 text-xs font-semibold text-[#829087] lg:px-8">
			<div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<Link to="/" className="flex items-center gap-2.5 text-[#27352f]" aria-label="Moneyleh home">
					<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#27352f] text-[#f8d66d] shadow-[2px_2px_0_#9ed9c2]"><Leaf size={16} /></span>
					<span className="font-bold tracking-[-0.04em]">moneyleh</span>
				</Link>
				<nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Legal links">
					<Link to="/privacy" className="transition-colors hover:text-[#27352f]">Privacy policy</Link>
					<Link to="/terms" className="transition-colors hover:text-[#27352f]">Terms and conditions</Link>
					<a href="mailto:coconut.dev123@gmail.com" aria-label="Email the developer" title="Email the developer" className="inline-flex items-center justify-center rounded-full p-1 text-[#627069] transition-colors hover:bg-[#edf7ed] hover:text-[#27352f]"><Mail size={16} /></a>
				</nav>
			</div>
		</footer>
	);
}
