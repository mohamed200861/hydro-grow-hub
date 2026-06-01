import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/manifest.webmanifest")({
  server: {
    handlers: {
      GET: async () => {
        const manifest = {
          name: "Growing Knowledge — Laboratorio di Idroponica",
          short_name: "Growing Knowledge",
          description:
            "Laboratorio di idroponica dell'IIS Caramuel Roncalli di Vigevano. Sostenibilità, ricerca scientifica e uso responsabile dell'acqua.",
          start_url: "/",
          scope: "/",
          display: "standalone",
          orientation: "portrait",
          background_color: "#ffffff",
          theme_color: "#1d4ed8",
          lang: "it-IT",
          categories: ["education", "science", "sustainability"],
          icons: [
            { src: "/logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
          ],
        };
        return new Response(JSON.stringify(manifest), {
          headers: {
            "Content-Type": "application/manifest+json; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
