import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageOff, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

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

  const openIndex = openId ? photos.findIndex((p) => p.id === openId) : -1;
  const open = openIndex >= 0 ? photos[openIndex] : null;

  function go(delta: number) {
    if (openIndex < 0 || photos.length === 0) return;
    const next = (openIndex + delta + photos.length) % photos.length;
    setOpenId(photos[next].id);
  }

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
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpenId(p.id)}
                className="mb-5 block w-full overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
              >
                <img
                  src={p.file_url}
                  alt={p.title ?? "Foto del progetto"}
                  loading={i < 6 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={i < 3 ? "high" : "auto"}
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
        <Lightbox
          photo={open}
          onClose={() => setOpenId(null)}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          hasMany={photos.length > 1}
        />
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

function Lightbox({
  photo,
  onClose,
  onPrev,
  onNext,
  hasMany,
}: {
  photo: MediaRow;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasMany: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  // reset on photo change
  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [photo.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 4));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.25, 1));
      if (e.key === "0") { setZoom(1); setOffset({ x: 0, y: 0 }); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);


  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-2 backdrop-blur animate-fade-in sm:p-4"
    >
      {/* Top bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-full bg-white/10 p-1.5 backdrop-blur md:right-5 md:top-5"
      >
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
          className="rounded-full p-2 text-white hover:bg-white/15 disabled:opacity-40"
          disabled={zoom <= 1}
          aria-label="Riduci zoom"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <span className="min-w-[44px] text-center text-xs font-semibold text-white tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z + 0.25, 4))}
          className="rounded-full p-2 text-white hover:bg-white/15 disabled:opacity-40"
          disabled={zoom >= 4}
          aria-label="Aumenta zoom"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
          className="rounded-full p-2 text-white hover:bg-white/15"
          aria-label="Ripristina zoom"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-white hover:bg-white/15"
          aria-label="Chiudi"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:left-5"
            aria-label="Foto precedente"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:right-5"
            aria-label="Foto successiva"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full flex-col items-center justify-center overflow-hidden"
      >
        <div
          className="relative flex h-[88vh] w-[95vw] items-center justify-center overflow-hidden select-none"
          style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in" }}
          onPointerDown={(e) => {
            if (zoom <= 1) {
              setZoom(2);
              return;
            }
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
            setDragging(true);
          }}
          onPointerMove={(e) => {
            const d = dragRef.current;
            if (!d) return;
            setOffset({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) });
          }}
          onPointerUp={(e) => {
            dragRef.current = null;
            setDragging(false);
            try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
          }}
          onDoubleClick={() => {
            if (zoom > 1) { setZoom(1); setOffset({ x: 0, y: 0 }); }
            else setZoom(2);
          }}
        >
          <img
            src={photo.file_url}
            alt={photo.title ?? ""}
            draggable={false}
            className="max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-150 ease-out"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transformOrigin: "center center",
            }}
          />
        </div>
        {(photo.title || photo.description) && (
          <div className="mt-3 max-w-3xl text-center text-white">
            {photo.title && <p className="text-sm font-semibold md:text-base">{photo.title}</p>}
            {photo.description && <p className="mt-1 text-xs opacity-80 md:text-sm">{photo.description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
