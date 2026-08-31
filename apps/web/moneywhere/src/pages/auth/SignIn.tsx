import {Card, CardContent, CardHeader} from "@shared/components/ui/card";
import {useState} from 'react';
import {useConvexAuth} from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import {Input} from "@shared/components/ui/input";
import {Label} from "@shared/components/ui/label";
import {useNavigate, useSearchParams, Link, Navigate} from "react-router-dom";
import {Button} from "@shared/components/ui/button";

export default function SignIn (){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // const {isAuthenticated, isLoading} = useConvexAuth();
    const { signIn } = useAuthActions();

    // const oauthError = searchParams.get("error");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try{
            const formData = new FormData(e.currentTarget);
            formData.set("email", email);
            formData.set("password", password);
            formData.set("flow", "signIn");
            await signIn("password", formData);
            navigate("/dashboard");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unable to sign in.";
            setError(message);
        } finally {
            setLoading(false);
        }  
    };

    

    return (
        <div className="flex-1 flex flex-col justify-center items-center p-8">
        <Card className="w-full max-w-md shadow-none border-none">
          <CardHeader className="flex flex-col items-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-2">
              <span className="text-white font-bold text-2xl">J</span>
            </div>
            <h2 className="text-3xl font-bold">Sign in</h2>
            <p className="text-muted-foreground text-center">
              Take the next step and sign in to your account
            </p>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/forgot-password"
                  className="text-primary font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              {error && (
                <div className="text-destructive text-sm text-center">{error}</div>
              )}
              <Button type="submit" disabled={loading} className="w-full rounded-full">
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* {oauthError && (<div className="text-destructive text-sm text-center">{oauthError}</div>)} */}

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border py-2 px-4 text-sm font-medium transition-colors hover:bg-muted/50"
              onClick={async () => {
                try {
                  await signIn("google", { redirectTo: "/dashboard" });
                } catch (err: unknown) {
                  // OAuth redirect errors are expected — ignore
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-sm text-muted-foreground text-center mt-6 lg:hidden">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-primary font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

    );
}

