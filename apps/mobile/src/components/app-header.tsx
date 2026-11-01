import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "@web_backend/convex/_generated/api";
import { AppHeader as Header } from "./ui";

export default function AppHeader() {
  const profile = useQuery(api.profile.getProfile);
  const router = useRouter();

  return (
    <Header
      username={profile?.username}
      photo={profile?.pfp}
      onPressProfile={() => router.push("/profile")}
    />
  );
}
