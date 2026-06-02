import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { renderSitemapXml } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(renderSitemapXml(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=300, must-revalidate",
            "X-Robots-Tag": "index, follow",
          },
        });
      },
    },
  },
});
