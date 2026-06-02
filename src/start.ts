import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Inject security & cache headers on every response without altering the body.
const securityHeadersMiddleware = createMiddleware().server(async ({ next, request }) => {
  const response = await next();
  const res = response instanceof Response ? response : new Response(response as BodyInit);
  const headers = new Headers(res.headers);

  // Conservative security headers — do NOT add a CSP that could break inline scripts/styles.
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("X-DNS-Prefetch-Control", "on");

  // Long cache for static assets, short cache for HTML.
  const path = new URL(request.url).pathname;
  const contentType = headers.get("content-type") ?? "";
  const isStaticAsset =
    /\.(?:js|mjs|css|woff2?|ttf|otf|eot|png|jpg|jpeg|webp|avif|gif|svg|ico|mp4|webm|ogv)$/i.test(path);

  if (!headers.has("Cache-Control")) {
    if (isStaticAsset) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else if (contentType.includes("text/html")) {
      headers.set("Cache-Control", "public, max-age=0, s-maxage=600, must-revalidate");
    }
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, securityHeadersMiddleware],
}));
