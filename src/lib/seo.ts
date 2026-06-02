export const SEO_ORIGIN = "https://idroponicamente.it" as const;

export interface SitemapEntry {
  path: "/" | "/galleria" | "/video" | "/riconoscimenti" | "/contatti";
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
}

export const SITEMAP_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/galleria", changefreq: "weekly", priority: "0.8" },
  { path: "/video", changefreq: "weekly", priority: "0.8" },
  { path: "/riconoscimenti", changefreq: "monthly", priority: "0.8" },
  { path: "/contatti", changefreq: "yearly", priority: "0.5" },
];

export function absoluteUrl(path: string = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SEO_ORIGIN}${normalizedPath}`;
}

export function renderSitemapXml(lastmod = new Date().toISOString().split("T")[0]) {
  const urls = SITEMAP_ENTRIES.map((entry) =>
    [
      "  <url>",
      `    <loc>${absoluteUrl(entry.path)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${entry.changefreq}</changefreq>`,
      `    <priority>${entry.priority}</priority>`,
      "  </url>",
    ].join("\n"),
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export const ROBOTS_TXT = `# Robots.txt — Growing Knowledge / Idroponicamente
# IIS Caramuel Roncalli — Vigevano

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /login
Disallow: /api/

# Allow major image and video crawlers full access to public content
User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /login
Disallow: /api/

User-agent: Googlebot-Image
Allow: /

User-agent: Googlebot-Video
Allow: /

User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /login
Disallow: /api/

# Block aggressive SEO scrapers
User-agent: AhrefsBot
Disallow: /
User-agent: SemrushBot
Disallow: /
User-agent: DotBot
Disallow: /
User-agent: MJ12bot
Disallow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;
