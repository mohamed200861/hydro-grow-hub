Obiettivo: evitare definitivamente il doppio bundling Cloudflare/Wrangler senza modificare layout, testi, immagini, video, routing applicativo, backend o contenuti visibili.

Configurazione finale scelta:
- `wrangler.toml` assente.
- `wrangler.jsonc` punta a `dist/server/index.mjs`.
- `assets.directory` punta a `dist/client`.
- `build.command` è `npm run build`.
- `no_bundle` è `true`.
- Nessun alias, nessuna `rules` e nessuno shim manuale per moduli virtuali TanStack.

Risultato atteso:
- Wrangler pubblica il bundle già generato da Vite/TanStack Start.
- Cloudflare non deve più tentare di ricompilare i moduli virtuali TanStack.
- Il sito resta identico visivamente e funzionalmente.
- Sitemap/SEO non vengono alterati.