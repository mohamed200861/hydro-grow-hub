import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Accesso area riservata — Growing Knowledge" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const fn = mode === "login" ? signIn : signUp;
    const { error } = await fn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error(error);
      return;
    }
    if (mode === "signup") {
      toast.success("Registrazione completata. Controlla la tua email per confermare l'account.");
    } else {
      toast.success("Accesso effettuato");
      void navigate({ to: "/admin" });
    }
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16 md:py-24">
      <div className="w-full rounded-3xl border border-border/70 bg-background p-8 shadow-[var(--shadow-elegant)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-primary">
          {mode === "login" ? "Accesso area riservata" : "Crea account amministratore"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Solo l'amministratore del progetto può caricare e gestire i contenuti.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground/80">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Attendere…" : mode === "login" ? "Accedi" : "Registrati"}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-muted-foreground">
          {mode === "login" ? (
            <>
              Non hai ancora un account?{" "}
              <button onClick={() => setMode("signup")} className="font-semibold text-primary hover:underline">
                Registrati
              </button>
            </>
          ) : (
            <>
              Hai già un account?{" "}
              <button onClick={() => setMode("login")} className="font-semibold text-primary hover:underline">
                Accedi
              </button>
            </>
          )}
        </div>
        <div className="mt-3 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:underline">
            ← Torna alla home
          </Link>
        </div>
      </div>
    </section>
  );
}
