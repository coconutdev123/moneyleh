import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@shared/components/ui/button";
import { Card, CardHeader, CardContent } from "@shared/components/ui/card";
import { Input } from "@shared/components/ui/input"
import { Label } from "@shared/components/ui/label"

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setMessage("If the email exists, a reset link has been sent.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #B2F7EF 0%, #FAD961 100%)" }}>
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-2">
            <span className="text-white font-bold text-2xl">J</span>
          </div>
          <h2 className="text-2xl font-bold">Forgot Password?</h2>
          <p className="text-muted-foreground text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-destructive text-sm text-center">{error}</div>
            )}
            {message && (
              <div className="text-green-600 text-sm text-center">{message}</div>
            )}
            <Button type="submit" disabled={loading} className="w-full rounded-full">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <Link to="/sign-in" className="text-center text-sm text-primary hover:underline mt-1">
              Back to Sign In
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}