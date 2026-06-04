Obiettivo: risolvere l’errore Cloudflare `Could not resolve "tanstack-start-manifest:v"` senza modificare layout, testi, immagini, video, routing applicativo, backend o contenuti visibili.

Piano di intervento:

1. Correggere la configurazione Wrangler usata dal deploy
   - Cloudflare sta eseguendo `npx wrangler deploy` e legge la configurazione Wrangler.
   - Gli alias attuali sono presenti, ma la forma `[alias]` in `wrangler.toml` può non essere interpretata correttamente dal bundler di Wrangler in questa pipeline.
   - Convertirò la configurazione alias nel formato previsto da Wrangler, usando `rules` con `type = "ESModule"` per mappare esplicitamente:
     - `tanstack-start-manifest:v`
     - `tanstack-start-injected-head-scripts:v`
   - Mantengo anche la configurazione JSON coerente, così non ci sono divergenze tra `wrangler.toml` e `wrangler.jsonc`.

2. Rendere gli shim TanStack compatibili con il runtime di deploy
   - Verificherò che gli shim esportino esattamente ciò che TanStack Start si aspetta.
   - In particolare `tanstack-start-manifest:v` deve esportare `tsrStartManifest` in una forma sicura per SSR/Worker.
   - Nessun contenuto visibile del sito verrà toccato.

3. Mantenere intatti SEO, sitemap e dominio
   - Non cambierò testi SEO già impostati, canonical, Open Graph o schema se non necessario per la build.
   - Controllerò che non vengano reintrodotti riferimenti a `lovable.app` nei file SEO/sitemap.

4. Validazione tecnica finale
   - Verificherò che non restino import virtuali non risolti nella configurazione Cloudflare.
   - Controllerò i file di configurazione e gli shim modificati.
   - Non farò modifiche visive, non toccherò immagini/video/riconoscimenti e non toccherò database/RLS/admin.

File previsti:
- `wrangler.toml`
- `wrangler.jsonc`
- eventualmente `src/lib/tanstack-manifest-shim.ts`
- eventualmente `src/lib/tanstack-head-scripts-shim.ts`

Risultato atteso:
- Cloudflare non dovrà più fallire su `tanstack-start-manifest:v`.
- Il sito resterà identico visivamente e funzionalmente.
- Sitemap/SEO non saranno alterati né peggiorati.