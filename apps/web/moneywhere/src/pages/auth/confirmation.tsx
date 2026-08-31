import { Link } from "react-router-dom";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import { Mail } from "lucide-react";

export default function Confirmation() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6">
        <span className="text-white font-bold text-2xl">J</span>
      </div>
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Check your email</h2>
          <p className="text-muted-foreground mb-6 text-center">
            We've sent a confirmation email. Click the link in the email to complete your account setup.
          </p>
          <Link to="/sign-in" className="w-full">
            <Button className="w-full rounded-full">Back to Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}