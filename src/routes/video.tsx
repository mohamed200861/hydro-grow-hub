import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoOff } from "lucide-react";

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
      <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Video
          </span>
          <h1 className="mt-4 text-3xl font-bold text-primary md:text-5xl">
            Video del progetto
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Il racconto in immagini del laboratorio di idroponica e della sua evoluzione.
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
