import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const SITE_URL = "https://idroponicamente.it";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Pagina non trovata</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Torna alla home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Si è verificato un errore</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Si è verificato un errore imprevisto. Riprova più tardi.
        </p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Riprova
        </button>
      </div>
    </div>
  );
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#school`,
      name: "IIS Caramuel Roncalli",
      alternateName: "Istituto Caramuel Roncalli",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vigevano",
        addressRegion: "Lombardia",
        addressCountry: "IT",
      },
      areaServed: ["Vigevano", "Lomellina", "Lombardia", "Italia"],
    },
    {
      "@type": "Project",
      "@id": `${SITE_URL}/#project`,
      name: "Growing Knowledge — Laboratorio di Idroponica",
      alternateName: ["Growing Knowledge", "Idroponicamente"],
      url: SITE_URL,
      description:
        "Progetto educativo e scientifico di coltivazione idroponica dell'IIS Caramuel Roncalli di Vigevano: sostenibilità, ricerca, scuola e territorio della Lomellina.",
      inLanguage: "it-IT",
      keywords:
        "idroponica, idroponicamente, growing knowledge, coltivazione idroponica, laboratorio idroponica, idroponica scuola, idroponica Vigevano, idroponica Lomellina, sostenibilità, hydroponics, IIS Caramuel Roncalli",
      image: `${SITE_URL}/logo.png`,
      parentOrganization: { "@id": `${SITE_URL}/#school` },
      sponsor: {
        "@type": "GovernmentOrganization",
        name: "Ministero dell'Istruzione e del Merito",
      },
      location: {
        "@type": "Place",
        name: "Vigevano, Lomellina",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Vigevano",
          addressRegion: "Lombardia",
          addressCountry: "IT",
        },
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Growing Knowledge — Idroponicamente",
      inLanguage: "it-IT",
      publisher: { "@id": `${SITE_URL}/#school` },
    },
  ],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#1d4ed8" },
      { name: "format-detection", content: "telephone=no" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "author", content: "IIS Caramuel Roncalli — Vigevano" },
      { name: "publisher", content: "IIS Caramuel Roncalli" },
      { name: "generator", content: "Growing Knowledge" },
      { httpEquiv: "Content-Language", content: "it" },
      { name: "geo.region", content: "IT-PV" },
      { name: "geo.placename", content: "Vigevano" },
      { name: "geo.position", content: "45.3144;8.8567" },
      { name: "ICBM", content: "45.3144, 8.8567" },
      { property: "og:site_name", content: "Growing Knowledge — Idroponicamente" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@CaramuelRoncalli" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Growing Knowledge" },
      { name: "application-name", content: "Growing Knowledge" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo.webp", type: "image/webp" },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preload", as: "image", href: "/logo.webp", type: "image/webp", fetchPriority: "high" } as any,
      { rel: "preconnect", href: "https://lkvloujfuaphbpflbluh.supabase.co", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://lkvloujfuaphbpflbluh.supabase.co" },
      { rel: "alternate", hrefLang: "it", href: `${SITE_URL}/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationJsonLd),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthRouterBridge() {
  const router = useRouter();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
    });
    return () => subscription.unsubscribe();
  }, [router]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthRouterBridge />
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
