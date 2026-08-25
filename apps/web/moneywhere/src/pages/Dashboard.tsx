import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {
	const { user, signOut } = useAuth();

	return (
		<main className="mx-auto max-w-4xl p-8">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-gray-500">Signed in as</p>
					<h1 className="text-2xl font-semibold">{user?.displayName || user?.email}</h1>
				</div>
				<button type="button" onClick={signOut} className="rounded-md border px-4 py-2 text-sm">Sign out</button>
			</div>
		</main>
	);
}
