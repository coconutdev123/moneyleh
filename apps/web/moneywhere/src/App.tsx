import { useState } from "react";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./auth/AuthProvider";

export function App() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<"signIn" | "signUp">("signIn");

  if (user === undefined) return <main className="p-8">Loading...</main>;
  if (user) return <Dashboard />;

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
      {screen === "signIn" ? (
        <SignIn onSignUp={() => setScreen("signUp")} />
      ) : (
        <SignUp onSignIn={() => setScreen("signIn")} />
      )}
    </main>
  );
}

export default App;
