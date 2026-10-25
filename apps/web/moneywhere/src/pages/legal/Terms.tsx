import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections = [
	{
		title: "Using moneyleh",
		body: "You may use moneyleh only for lawful personal financial organization. You are responsible for the accuracy of information you enter, for keeping your sign-in credentials secure, and for activity under your account. Do not attempt to access another person’s account, disrupt the service, or upload harmful or unlawful content.",
	},
	{
		title: "Your data",
		body: "You retain your rights in the information you submit. You give moneyleh permission to host, process, display, back up, and otherwise use that information only as needed to provide, secure, and improve the service. Our Privacy Policy explains how personal information is handled, retained, and deleted.",
	},
	{
		title: "Financial disclaimer",
		body: "moneyleh is an organization and tracking tool, not a bank, financial adviser, accountant, broker, lender, or tax professional. Its calculations, summaries, reminders, and visualizations may be incomplete or inaccurate. Review important information independently and seek qualified professional advice before making financial, tax, or investment decisions.",
	},
	{
		title: "Availability and changes",
		body: "We work to keep moneyleh available and accurate, but the service may change, be interrupted, or contain errors. We may add, modify, or discontinue features and will make reasonable efforts to communicate material changes. We may suspend access when reasonably necessary to protect users, the service, or the law.",
	},
	{
		title: "Termination",
		body: "You may stop using moneyleh at any time and may request deletion of your account and personal information through the support channel provided in the app. We may suspend or terminate an account for misuse, security concerns, or legal requirements. Provisions that should reasonably survive termination, including security, disclaimers, and limitations of liability, will continue to apply.",
	},
	{
		title: "Limitation of liability",
		body: "To the maximum extent permitted by law, moneyleh and its contributors will not be responsible for indirect, incidental, special, consequential, or lost-profit damages arising from your use of or inability to use the service. Nothing in these terms limits rights or liability that cannot be limited under applicable law.",
	},
	{
		title: "Questions and updates",
		body: "If you have questions about these terms, contact the moneyleh team through the support channel provided in the app. We may update these terms as the service or legal requirements change. Continued use after an update means you accept the revised terms, except where applicable law requires another form of notice or consent.",
	},
];

export default function Terms() {
	return (
		<main className="min-h-screen bg-[#f8f6f0] px-4 py-8 text-[#27352f] sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl">
				<Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#627069] transition-colors hover:text-[#e88976]"><ArrowLeft size={16} /> Back to moneyleh</Link>
				<header className="mt-12 max-w-2xl">
					<p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#e88976]">Clear expectations</p>
					<h1 className="text-4xl font-black tracking-[-0.07em] sm:text-5xl">Terms and conditions</h1>
					<p className="mt-4 text-sm leading-7 text-[#75837b]">Effective date: September 25, 2026. These terms describe the rules for using moneyleh and the limits of what the service provides.</p>
				</header>
				<div className="mt-10 space-y-4">
					{sections.map((section) => <section key={section.title} className="rounded-2xl border border-[#dce6dc] bg-white/85 p-6 shadow-[0_8px_20px_rgba(39,53,47,0.03)]"><h2 className="text-lg font-black tracking-[-0.03em]">{section.title}</h2><p className="mt-2 text-sm leading-7 text-[#627069]">{section.body}</p></section>)}
				</div>
				<p className="mt-8 text-xs leading-6 text-[#829087]">These terms are a general product agreement and are not legal advice. Have qualified counsel review them for the jurisdictions where moneyleh operates.</p>
			</div>
		</main>
	);
}
