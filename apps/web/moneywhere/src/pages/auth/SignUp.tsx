import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@shared/components/ui/button";
import { Card, CardHeader, CardContent } from "@shared/components/ui/card";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: "Weak", color: "bg-destructive" };
  if (score === 2) return { label: "Fair", color: "bg-yellow-500" };
  if (score === 3) return { label: "Good", color: "bg-blue-500" };
  return { label: "Strong", color: "bg-green-500" };
}

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupSucceeded, setSignupSucceeded] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const [searchParams] = useSearchParams();
  const oauthError = searchParams.get("error");

  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (!signupSucceeded) return;

    if (showSuccessModal) {
      const timeout = window.setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);

      return () => window.clearTimeout(timeout);
    }

    navigate("/sign-in", { replace: true });
  }, [signupSucceeded, showSuccessModal, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!terms) {
      setError("You must agree with the terms and conditions.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!PASSWORD_RULES.every((r) => r.test(password))) {
      setError("Password does not meet all requirements.");
      return;
    }

    setLoading(true);
    setError("");
    setSignupSucceeded(false);
    setShowSuccessModal(false);

    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      formData.set("flow", "signUp");
      formData.set("username", username);
      await signIn("password", formData);
      setSignupSucceeded(true);
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      setSignupSucceeded(false);
      setShowSuccessModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6">
        <span className="text-white font-bold text-2xl">J</span>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-2xl border bg-background p-6 shadow-lg">
            <button
              type="button"
              aria-label="Close success modal"
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-4 top-4 text-muted-foreground transition hover:text-foreground"
            >
              ✕
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
              ✓
            </div>
            <h3 className="text-xl font-semibold">Account created successfully!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your signup was successful. You will be redirected to the sign in page shortly.
            </p>
          </div>
        </div>
      )}

      <Card className="w-full max-w-md">
        <CardHeader className="border-b">
          <h2 className="text-xl font-bold text-center">Create an account</h2>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Create your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password.length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-24 rounded-full ${strength.color}`} />
                    <span className="text-xs font-medium">{strength.label}</span>
                  </div>
                  <ul className="text-xs space-y-1">
                    {PASSWORD_RULES.map((rule) => (
                      <li
                        key={rule.label}
                        className={rule.test(password) ? "text-green-600" : "text-muted-foreground"}
                      >
                        {rule.test(password) ? "\u2713" : "\u2022"} {rule.label}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="space-y-2">
              <Label>Confirm password</Label>
              <Input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="rounded border-border"
              />
              <span className="font-medium">I agree with the terms and conditions</span>
            </label>
            {error && (
              <div className="text-destructive text-sm text-center">{error}</div>
            )}
            <Button type="submit" disabled={loading} className="w-full rounded-full mt-2">
              {loading ? "Creating account..." : "Sign Up"} 
            </Button>
          </form>

          {oauthError && (
            <div className="text-destructive text-sm text-center mt-4">
              {oauthError}
            </div>
          )}

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-border rounded-full py-2 px-4 text-sm font-medium hover:bg-muted/50 transition-colors"
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
              Google
            </button>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-primary font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}