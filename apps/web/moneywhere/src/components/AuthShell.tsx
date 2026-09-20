import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export default function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f6f0] px-4 py-10 text-[#27352f] sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(158,217,194,0.35),transparent_24%),radial-gradient(circle_at_90%_80%,rgba(169,199,245,0.36),transparent_28%)]" />
      <div className="pointer-events-none absolute -left-20 top-20 h-40 w-40 rounded-full bg-[#f8d66d]/35 blur-2xl" />
      <div className="pointer-events-none absolute -right-16 top-8 h-44 w-44 rounded-full bg-[#e88976]/20 blur-3xl" />
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="mb-8 flex justify-center" aria-label="Moneywhere home">
          <span className="flex items-center gap-2.5 text-[#27352f]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#27352f] text-[#f8d66d] shadow-[3px_3px_0_#9ed9c2]"><Leaf size={20} strokeWidth={2.5} /></span><span className="text-xl font-bold tracking-[-0.04em]">moneyleh</span></span>
        </Link>
        <section className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-6 shadow-[10px_14px_0_rgba(169,199,245,0.25)] backdrop-blur-sm sm:p-8">
          <div className="mb-7 text-center"><p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#e88976]">{eyebrow}</p><h1 className="text-3xl font-black tracking-[-0.06em]">{title}</h1><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#75837b]">{description}</p></div>
          {children}
        </section>
        <div className="mt-5 text-center text-sm text-[#75837b]">{footer}</div>
      </div>
    </main>
  );
}