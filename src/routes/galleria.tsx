import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageOff, X } from "lucide-react";

export const Route = createFileRoute("/galleria")({
  head: () => ({
    meta: [
      { title: "Galleria foto — Growing Knowledge" },
      { name: "description", content: "Le immagini del laboratorio di idroponica Growing Knowledge dell'IIS Caramuel Roncalli di Vigevano." },
      { property: "og:title", content: "Galleria foto — Growing Knowledge" },
      { property: "og:description", content: "Le immagini del progetto di idroponica." },
    ],
  }),
  component: GalleriaPage,
});

interface MediaRow {
  id: string;
  title: string | null;
  description: string | null;
  file_url: string;
}

function GalleriaPage() {
  const [photos, setPhotos] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("media_files")
      .select("id, title, description, file_url")
      .eq("file_type", "image")
      .eq("is_published", true)
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });
    setPhotos(data ?? []);
    setLoading(false);
  }

  const open = openId ? photos.find((p) => p.id === openId) ?? null : null;

  return (
    <div>
      <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Galleria
          </span>
          <h1 className="mt-4 text-3xl font-bold text-primary md:text-5xl">
            Galleria foto
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Le immagini del laboratorio, delle attività sul territorio e della
            ricerca scientifica condotta dagli studenti.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        {loading ? (
          <GridSkeleton />
        ) : photos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:_balance]">
            {photos.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpenId(p.id)}
                className="mb-5 block w-full overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
              >
                <img
                  src={p.file_url}
                  alt={p.title ?? "Foto del progetto"}
                  loading="lazy"
                  className="block w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
                {(p.title || p.description) && (
                  <div className="p-4 text-left">
                    {p.title && <p className="text-sm font-semibold text-primary">{p.title}</p>}
                    {p.description && (
                      <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {open && (
        <Lightbox photo={open} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-dashed border-border bg-muted/40 p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary">
        <ImageOff className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-primary">Nessuna foto caricata al momento</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Le immagini caricate dall'amministratore appariranno automaticamente in questa pagina.
      </p>
    </div>
  );
}

function Lightbox({ photo, onClose }: { photo: MediaRow; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/95 p-4 backdrop-blur"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full bg-background/15 p-2 text-white hover:bg-background/25"
        aria-label="Chiudi"
      >
        <X className="h-5 w-5" />
      </button>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] max-w-5xl">
        <img
          src={photo.file_url}
          alt={photo.title ?? ""}
          className="max-h-[80vh] w-auto rounded-2xl object-contain"
        />
        {(photo.title || photo.description) && (
          <div className="mt-4 text-center text-white">
            {photo.title && <p className="text-base font-semibold">{photo.title}</p>}
            {photo.description && <p className="mt-1 text-sm opacity-80">{photo.description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
