import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Award, Trophy } from "lucide-react";

export const Route = createFileRoute("/riconoscimenti")({
  head: () => ({
    meta: [
      { title: "Riconoscimenti e traguardi — Growing Knowledge" },
      {
        name: "description",
        content:
          "Esperienze, eventi e risultati che hanno valorizzato il progetto Growing Knowledge dell'IIS Caramuel Roncalli di Vigevano.",
      },
      { property: "og:title", content: "Riconoscimenti e traguardi — Growing Knowledge" },
      {
        property: "og:description",
        content: "I premi, gli eventi e i traguardi del progetto Growing Knowledge.",
      },
    ],
  }),
  component: RiconoscimentiPage,
});

interface RecognitionRow {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

function RiconoscimentiPage() {
  const [items, setItems] = useState<RecognitionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("recognitions")
      .select("id, title, description, image_url")
      .eq("is_published", true)
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 55%, var(--accent) 100%)",
          }}
        />
        <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(circle_at_20%_30%,white,transparent_45%),radial-gradient(circle_at_85%_75%,white,transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 text-center text-primary-foreground">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Trophy className="h-7 w-7" />
          </div>
          <span className="mt-5 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            Riconoscimenti
          </span>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl lg:text-6xl">
            Riconoscimenti e traguardi
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base opacity-90 md:text-lg">
            Esperienze, eventi e risultati che hanno valorizzato il progetto Growing Knowledge.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r, i) => (
              <RecognitionCard key={r.id} item={r} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function RecognitionCard({ item, index }: { item: RecognitionRow; index: number }) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-background shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-elegant)] animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-muted">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--secondary), var(--accent))",
            }}
          >
            <Award className="h-12 w-12 text-white/80" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
          <Award className="h-3.5 w-3.5" /> Riconoscimento
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-lg font-bold leading-snug text-primary md:text-xl">{item.title}</h2>
        {item.description && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        )}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-dashed border-border bg-muted/40 p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary">
        <Trophy className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-primary">
        Nessun riconoscimento pubblicato al momento
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        I riconoscimenti aggiunti dall'amministratore appariranno automaticamente qui.
      </p>
    </div>
  );
}
