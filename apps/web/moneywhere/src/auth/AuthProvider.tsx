import { createContext, useContext, useState, type ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../packages/web_backend/convex/_generated/api";

const SESSION_KEY = "moneywhere_session";

type AuthContextValue = {
  user: { id: string; email: string; displayName?: string } | null | undefined;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem(SESSION_KEY));
  const user = useQuery(api.auth.currentUser, token ? { token } : "skip");
  const signInMutation = useMutation(api.auth.signIn);
  const signUpMutation = useMutation(api.auth.signUp);
  const signOutMutation = useMutation(api.auth.signOut);

  async function saveSession(operation: Promise<{ token: string }>) {
    const result = await operation;
    localStorage.setItem(SESSION_KEY, result.token);
    setToken(result.token);
  }

  async function signOut() {
    if (token) await signOutMutation({ token });
    localStorage.removeItem(SESSION_KEY);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: (email, password) => saveSession(signInMutation({ email, password })),
        signUp: (email, password) => saveSession(signUpMutation({ email, password })),
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}