import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections = [
	{
		title: "Information we collect",
		body: "When you create an account, we collect the information needed to provide the service, such as your email address, username, and authentication details. When you use moneyleh, you may provide profile information, expenses, budgets, wishlist items, savings amounts, and related notes. We may also receive basic device, browser, and security information needed to keep the service reliable.",
	},
	{
		title: "How we use information",
		body: "We use your information to authenticate you, save and display your financial entries, provide dashboards and wishlist features, respond to requests, prevent misuse, maintain security, and improve the service. We do not use your personal financial entries to provide financial advice or make decisions about your eligibility for products or services.",
	},
	{
		title: "Storage and security",
		body: "Your account and application data are stored with our application and cloud service providers. Access is limited to the people and systems that need it to operate, secure, and support moneyleh. We use reasonable administrative, technical, and organizational safeguards, but no online service can guarantee absolute security.",
	},
	{
		title: "Retention and deletion",
		body: "We retain account and application data while your account is active and for only as long as reasonably necessary for the purposes described here, including security, dispute resolution, and legal obligations. You may request correction or deletion of your personal information by contacting the moneyleh team through the support channel provided in the app. We will verify the request and delete or de-identify information unless we must retain it for a lawful reason.",
	},
	{
		title: "Sharing",
		body: "We do not sell your personal information. We may share limited information with service providers that host, authenticate, secure, or support the service, and when required by law or necessary to protect users and the service. Providers may process information only to perform their services for us.",
	},
	{
		title: "Your choices and rights",
		body: "Depending on where you live, you may have rights to access, correct, export, or delete your personal information, restrict or object to certain processing, and withdraw consent where processing is based on consent. You can update some profile information in the app and can contact us for other requests. We will not discriminate against you for exercising applicable privacy rights.",
	},
	{
		title: "Cookies and similar technology",
		body: "moneyleh may use essential cookies or local storage to keep you signed in, protect the service, and remember necessary preferences. We do not use these tools to sell your personal information. Browser settings may limit essential storage, but some features may stop working.",
	},
	{
		title: "Children and changes",
		body: "moneyleh is not intended for children under the age required to consent to online services in their location. We may update this policy when the service or legal requirements change. We will post the updated version here and revise the effective date.",
	},
];

export default function Privacy() {
	return (
		<main className="min-h-screen bg-[#f8f6f0] px-4 py-8 text-[#27352f] sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl">
				<Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#627069] transition-colors hover:text-[#e88976]"><ArrowLeft size={16} /> Back to moneyleh</Link>
				<header className="mt-12 max-w-2xl">
					<p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#e88976]">Your information, handled carefully</p>
					<h1 className="text-4xl font-black tracking-[-0.07em] sm:text-5xl">Privacy policy</h1>
					<p className="mt-4 text-sm leading-7 text-[#75837b]">Effective date: September 25, 2026. This policy explains what moneyleh collects, why we use it, how long we keep it, and the choices available to you.</p>
				</header>
				<div className="mt-10 space-y-4">
					{sections.map((section) => <section key={section.title} className="rounded-2xl border border-[#dce6dc] bg-white/85 p-6 shadow-[0_8px_20px_rgba(39,53,47,0.03)]"><h2 className="text-lg font-black tracking-[-0.03em]">{section.title}</h2><p className="mt-2 text-sm leading-7 text-[#627069]">{section.body}</p></section>)}
				</div>
				<p className="mt-8 text-xs leading-6 text-[#829087]">This policy is a general product policy and is not legal advice. Local privacy laws may provide additional rights or require additional disclosures.</p>
			</div>
		</main>
	);
}
