import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../../../../../packages/shared/src/components/ui/card";    
import { useState, type FormEvent } from "react";
import { useAuth } from "../../auth/AuthProvider";

export default function SignUp({ onSignIn }: { onSignIn: () => void }) {
    const { signUp } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const password = String(form.get("password"));
        if (password !== String(form.get("confirm_password"))) {
            setError("Passwords do not match.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await signUp(String(form.get("email")), password);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Unable to create account.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="new-password"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirm_password"
                            id="confirm_password"
                            autoComplete="new-password"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-gray-500">Already have an account?{" "}
                    <button type="button" onClick={onSignIn} className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</button>
                </p>
            </CardFooter>
        </Card>
    );
}


