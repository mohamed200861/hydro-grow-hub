import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoOff, PlayCircle, Microscope, Leaf, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/video")({
  head: () => ({
    meta: [
      { title: "Video del progetto — Growing Knowledge" },
      { name: "description", content: "Il video del laboratorio di idroponica Growing Knowledge dell'IIS Caramuel Roncalli." },
      { property: "og:title", content: "Video del progetto — Growing Knowledge" },
      { property: "og:description", content: "Guarda il video del progetto di idroponica." },
    ],
  }),
  component: VideoPage,
});

interface VideoRow {
  id: string;
  title: string | null;
  description: string | null;
  file_url: string;
}

function VideoPage() {
  const [video, setVideo] = useState<VideoRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("media_files")
      .select("id, title, description, file_url")
      .eq("file_type", "video")
      .eq("is_published", true)
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setVideo(data);
    setLoading(false);
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(135deg, oklch(0.28 0.10 250) 0%, oklch(0.38 0.12 210) 60%, oklch(0.45 0.13 175) 100%)" }}
        />
        <div className="absolute inset-0 -z-10 bg-black/30" />
        <div className="absolute inset-0 -z-10 opacity-15 bg-[radial-gradient(circle_at_20%_30%,white,transparent_40%),radial-gradient(circle_at_80%_70%,white,transparent_45%)]" />
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 text-center text-white [text-shadow:0_2px_12px_rgb(0_0_0/0.35)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/25">
            <PlayCircle className="h-7 w-7" />
          </div>
          <span className="mt-5 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur ring-1 ring-white/25">
            Video
          </span>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl lg:text-6xl">
            Video del progetto
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/95 md:text-lg">
            Scopri il percorso di Growing Knowledge attraverso immagini, ricerca e sperimentazione idroponica.
          </p>
        </div>
      </section>


      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-8 md:pb-20">
        {loading ? (
          <div className="mx-auto aspect-video w-full max-w-6xl animate-pulse rounded-[2rem] bg-muted" />
        ) : !video ? (
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-border bg-muted/40 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary">
              <VideoOff className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-primary">
              Nessun video pubblicato al momento
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Il video caricato dall'amministratore apparirà automaticamente in questa pagina.
            </p>
          </div>
        ) : (
          <div>
            <div className="relative mx-auto w-full max-w-6xl animate-fade-in">
              <div
                className="absolute -inset-3 rounded-[2.5rem] opacity-60 blur-2xl md:-inset-5"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary), var(--accent))" }}
              />
              <div
                className="relative overflow-hidden rounded-[2rem] p-1.5 shadow-[var(--shadow-elegant)] md:p-2"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary) 60%, var(--accent))" }}
              >
                <video
                  key={video.id}
                  src={video.file_url}
                  controls
                  playsInline
                  className="block aspect-video w-full rounded-[1.6rem] bg-black"
                />
              </div>
            </div>
            {(video.title || video.description) && (
              <div className="mt-6 text-center">
                {video.title && (
                  <h2 className="text-xl font-bold text-primary">{video.title}</h2>
                )}
                {video.description && (
                  <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
                    {video.description}
                  </p>
                )}
              </div>
            )}
            <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed text-foreground/80">
              Il video racconta il percorso del progetto, dall'osservazione del territorio
              alla sperimentazione idroponica, mostrando il valore scientifico, didattico e
              ambientale di <strong>Growing Knowledge</strong>.
            </p>
          </div>
        )}

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {[
            { icon: <Microscope className="h-5 w-5" />, title: "Ricerca", text: "Sperimentazioni scientifiche e collaborazioni universitarie." },
            { icon: <Leaf className="h-5 w-5" />, title: "Sostenibilità", text: "Riduzione del consumo idrico fino all'80–90%." },
            { icon: <Lightbulb className="h-5 w-5" />, title: "Innovazione", text: "Coltivazione idroponica indoor del riso." },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-border/60 bg-background p-6 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {c.icon}
              </div>
              <h3 className="mt-4 text-base font-bold text-primary">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
