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
