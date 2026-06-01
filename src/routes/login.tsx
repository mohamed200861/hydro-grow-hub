import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Accesso area riservata — Growing Knowledge" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error("Credenziali non valide");
      return;
    }
    toast.success("Accesso effettuato");
    void navigate({ to: "/admin" });
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16 md:py-24">
      <div className="w-full rounded-3xl border border-border/70 bg-background p-8 shadow-[var(--shadow-elegant)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-primary">
          Accesso area riservata
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
              autoComplete="email"
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
              autoComplete="current-password"
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
            {submitting ? "Attendere…" : "Accedi"}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-muted-foreground">
          La registrazione pubblica non è disponibile. L'amministratore è
          provisionato direttamente nel backend.
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
