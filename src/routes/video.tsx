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
          style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 60%, var(--accent) 100%)" }}
        />
        <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(circle_at_20%_30%,white,transparent_40%),radial-gradient(circle_at_80%_70%,white,transparent_45%)]" />
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 text-center text-primary-foreground">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <PlayCircle className="h-7 w-7" />
          </div>
          <span className="mt-5 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            Video
          </span>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl lg:text-6xl">
            Video del progetto
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base opacity-90 md:text-lg">
            Scopri il laboratorio Growing Knowledge attraverso immagini, esperimenti e momenti di ricerca.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
        {loading ? (
          <div className="aspect-video w-full animate-pulse rounded-3xl bg-muted" />
        ) : !video ? (
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-border bg-muted/40 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary">
              <VideoOff className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-primary">
              Nessun video caricato al momento
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Il video caricato dall'amministratore apparirà automaticamente in questa pagina.
            </p>
          </div>
        ) : (
          <div>
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-primary shadow-[var(--shadow-elegant)]">
              <video
                key={video.id}
                src={video.file_url}
                controls
                className="aspect-video w-full bg-black"
              />
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
          </div>
        )}
      </section>
    </div>
  );
}
