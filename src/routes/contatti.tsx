import { createFileRoute } from "@tanstack/react-router";
import { Mail, ArrowUpRight } from "lucide-react";

const SITE_URL = "https://idro11.lovable.app";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — Growing Knowledge | IIS Caramuel Roncalli Vigevano" },
      { name: "description", content: "Contatta i referenti del progetto Growing Knowledge, laboratorio di idroponica dell'IIS Caramuel Roncalli di Vigevano." },
      { name: "keywords", content: "contatti idroponica, growing knowledge contatti, IIS Caramuel Roncalli, Vigevano, referenti progetto idroponica" },
      { property: "og:title", content: "Contatti — Growing Knowledge" },
      { property: "og:description", content: "Contatta i referenti del progetto Growing Knowledge dell'IIS Caramuel Roncalli di Vigevano." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/contatti` },
      { property: "og:image", content: `${SITE_URL}/logo.png` },
      { name: "twitter:title", content: "Contatti — Growing Knowledge" },
      { name: "twitter:description", content: "Contatta i referenti del progetto Growing Knowledge." },
      { name: "twitter:image", content: `${SITE_URL}/logo.png` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/contatti` },
    ],
  }),
  component: ContattiPage,
});

const contacts = [
  { name: "Federico Barracca", email: "federico.barracca@caramuelroncalli.it" },
  { name: "Elisa Negri", email: "elisa.negri@caramuelroncalli.it" },
];

function ContattiPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
      <div className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary to-accent p-10 text-center text-primary-foreground shadow-[var(--shadow-elegant)] md:p-14">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
          <Mail className="h-6 w-6" />
        </div>
        <span className="mt-5 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/20">
          Contatti
        </span>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">
          Scrivici per saperne di più
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 md:text-base">
          Per informazioni sul progetto <strong>Growing Knowledge</strong> puoi
          contattare i referenti scolastici.
        </p>

        <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left">
          {contacts.map((c) => (
            <li key={c.email}>
              <a
                href={`mailto:${c.email}`}
                className="group flex items-center justify-between gap-4 rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/20"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="truncate text-xs opacity-85">{c.email}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 flex-shrink-0 opacity-80 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-xs opacity-75">
          IIS Caramuel Roncalli — Vigevano (PV)
        </p>
      </div>
    </section>
  );
}
