import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — Growing Knowledge" },
      { name: "description", content: "Contatta i referenti del progetto Growing Knowledge dell'IIS Caramuel Roncalli." },
    ],
  }),
  component: ContattiPage,
});

const emails = [
  "Federico.Barracca@caramuelroncalli.it",
  "Elisa.Negri@caramuelroncalli.it",
];

function ContattiPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
      <div className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary to-accent p-8 text-center text-primary-foreground shadow-[var(--shadow-elegant)] md:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
          <Mail className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-2xl font-bold md:text-3xl">Contatti</h1>
        <p className="mt-3 text-sm opacity-90">
          Per informazioni sul progetto Growing Knowledge:
        </p>
        <ul className="mt-6 space-y-2 text-sm">
          {emails.map((e) => (
            <li key={e}>
              <a
                href={`mailto:${e}`}
                className="inline-block rounded-full bg-white/15 px-4 py-2 font-medium transition hover:bg-white/25"
              >
                {e}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs opacity-75">
          IIS Caramuel Roncalli — Vigevano (PV)
        </p>
      </div>
    </section>
  );
}
