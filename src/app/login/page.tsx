import { Banner } from "@/components/terminal/banner";
import { AuthPanel } from "./auth-panel";

export const metadata = { title: "SIGN ON — SHORTCIRCUIT" };

export default function LoginPage() {
  return (
    <main>
      <Banner />
      <AuthPanel />
      <p className="mt-4 text-xs text-ink-dim">
        # ACCOUNTS ARE MANAGED BY SUPABASE AUTH. PASSWORDS STAY SERVER-SIDE.
      </p>
    </main>
  );
}
