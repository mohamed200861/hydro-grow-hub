## Guida completa: deploy del progetto su Cloudflare Pages

Segui questi passi nell'ordine. Sono pensati per il tuo progetto TanStack Start già configurato.

---

### 1. Prepara il repository GitHub

1. In Lovable: pulsante **GitHub** (in alto a destra) → **Connect to GitHub** → autorizza e crea il repository.
2. Verifica che nel repo siano presenti:
   - `package.json` con lo script `"build": "vite build"`
   - `vite.config.ts`
   - `wrangler.jsonc` (già corretto, senza virgola di troppo)
   - `src/server.ts`

---

### 2. Crea il progetto su Cloudflare Pages

1. Vai su [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Seleziona il repository GitHub appena collegato.
3. Nella schermata **Set up builds and deployments** inserisci:

| Campo | Valore |
|---|---|
| **Framework preset** | `None` (lascia vuoto / nessuno) |
| **Build command** | `npm run build` |
| **Build output directory** | `.output/public` |
| **Root directory** | (lascia vuoto) |
| **Node version** | `20` o superiore (variabile env `NODE_VERSION=20`) |

---

### 3. Variabili d'ambiente (Environment variables)

Nella sezione **Environment variables** → **Production** (e poi ripeti per **Preview**) aggiungi:

| Nome | Valore |
|---|---|
| `VITE_SUPABASE_URL` | `https://lkvloujfuaphbpflbluh.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrdmxvdWpmdWFwaGJwZmxibHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjQ2OTAsImV4cCI6MjA5NDQ0MDY5MH0.Dd02Y-VgNOBI6-qSCoYms10Qh91NdmbrB0DPIlsAz8s` |
| `VITE_SUPABASE_PROJECT_ID` | `lkvloujfuaphbpflbluh` |
| `SUPABASE_URL` | `https://lkvloujfuaphbpflbluh.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | (stesso valore di `VITE_SUPABASE_PUBLISHABLE_KEY`) |
| `NODE_VERSION` | `20` |

Premi **Save and Deploy**.

---

### 4. Verifica file strutturali nel repo

Controlla che esistano e siano corretti:

- **`wrangler.jsonc`** — già a posto:
  ```jsonc
  {
    "$schema": "node_modules/wrangler/config-schema.json",
    "name": "tanstack-start-app",
    "compatibility_date": "2025-09-24",
    "compatibility_flags": ["nodejs_compat"],
    "main": "src/server.ts"
  }
  ```
- **`vite.config.ts`** — deve usare `@lovable.dev/vite-tanstack-config` con `server.entry: "server"` (già così).
- **`src/server.ts`** — deve esportare un oggetto con `fetch` (già così).
- **`package.json`** — script `"build": "vite build"`.

---

### 5. Dopo il primo deploy

- L'URL provvisorio sarà tipo `tuo-progetto.pages.dev`.
- Se vuoi un dominio personalizzato: **Custom domains** → **Set up a custom domain**.
- Ogni push su `main` rideploya in produzione; gli altri branch creano preview.

---

### 6. Se la build fallisce

Controlla nei log Cloudflare:
- **`ParseError`** in `wrangler.jsonc` → virgola di troppo (già risolto).
- **`Missing Supabase environment variable`** → variabili non aggiunte o nome sbagliato.
- **`Output directory not found`** → hai messo `dist` invece di `.output/public`.
- **Node version error** → aggiungi `NODE_VERSION=20`.

Incollami il log e ti dico esattamente cosa correggere.

---

### Nota importante

Lovable pubblica già il tuo sito automaticamente su `https://idro11.lovable.app`. Cloudflare Pages serve solo se vuoi hostare il sito sul tuo account Cloudflare (es. per dominio personalizzato gestito lì o per integrazioni Cloudflare). Altrimenti puoi continuare a usare la pubblicazione integrata di Lovable.