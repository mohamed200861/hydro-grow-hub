import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight,
  Droplets,
  Microscope,
  GraduationCap,
  Leaf,
  Mountain,
  Sprout,
  Users,
  Camera,
  PlayCircle,
} from "lucide-react";

const SITE_URL = "idro11.lovable.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Growing Knowledge — Laboratorio di Idroponica | IIS Caramuel Roncalli Vigevano" },
      { name: "description", content: "Growing Knowledge: laboratorio di idroponica dell'IIS Caramuel Roncalli di Vigevano. Coltivazione idroponica, ricerca scientifica, sostenibilità e uso responsabile dell'acqua in Lomellina." },
      { name: "keywords", content: "idroponica, idroponicamente, growing knowledge, laboratorio idroponica, idroponica scuola, coltivazione idroponica, progetto idroponica, idroponica Vigevano, idroponica Lomellina, idroponica sostenibile, hydroponics school project, hydroponics education, IIS Caramuel Roncalli, sostenibilità, riso idroponico" },
      { property: "og:title", content: "Growing Knowledge — Laboratorio di Idroponica" },
      { property: "og:description", content: "Il laboratorio di idroponica dell'IIS Caramuel Roncalli di Vigevano: coltivare piante per crescere idee." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: `${SITE_URL}/logo.png` },
      { property: "og:image:alt", content: "Growing Knowledge — Laboratorio di Idroponica" },
      { name: "twitter:title", content: "Growing Knowledge — Laboratorio di Idroponica" },
      { name: "twitter:description", content: "Il laboratorio di idroponica dell'IIS Caramuel Roncalli di Vigevano." },
      { name: "twitter:image", content: `${SITE_URL}/logo.png` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [heroUrl, setHeroUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void supabase
      .from("media_files")
      .select("file_url")
      .eq("file_type", "hero")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setHeroUrl(data?.file_url ?? "/hero.jpg");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl -z-10" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl -z-10" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-14 md:px-8 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/60 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur">
              <Sprout className="h-3.5 w-3.5" /> Progetto #iosonoAmbiente
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
              GROWING<br />KNOWLEDGE
            </h1>
            <p className="mt-3 text-lg font-medium text-secondary">
              Coltivare piante per crescere idee
            </p>
            <h2 className="mt-6 text-xl font-semibold text-foreground sm:text-2xl">
              Laboratorio di Idroponica
            </h2>
            <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              IIS Caramuel Roncalli — Vigevano
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/80">
              Un progetto dedicato alla sostenibilità, alla ricerca scientifica
              e all'uso responsabile dell'acqua, dove studenti e professori
              coltivano insieme conoscenza e futuro.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#progetto"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:-translate-y-0.5"
              >
                Scopri il progetto <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/galleria"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-6 py-3 text-sm font-semibold text-primary hover:bg-muted"
              >
                <Camera className="h-4 w-4" /> Vai alla galleria
              </Link>
              <Link
                to="/video"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-6 py-3 text-sm font-semibold text-primary hover:bg-muted"
              >
                <PlayCircle className="h-4 w-4" /> Guarda il video
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/30 via-secondary/20 to-primary/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/30 p-2 shadow-[var(--shadow-elegant)] backdrop-blur">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-[1.6rem] bg-muted sm:aspect-[5/4] md:aspect-[4/5]">
                {heroUrl && (
                  <img
                    src={heroUrl}
                    alt="Laboratorio di idroponica Growing Knowledge"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                )}
              </div>
            </div>
            <div className="absolute -bottom-4 left-6 hidden rounded-2xl bg-background/95 px-4 py-3 shadow-[var(--shadow-soft)] sm:block">
              <p className="text-xs font-medium text-muted-foreground">Risparmio idrico</p>
              <p className="text-2xl font-extrabold text-secondary">80–90%</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: GENESI */}
      <Section id="progetto">
        <SectionHeader
          eyebrow="01 — Genesi"
          title="Genesi e contesto del progetto"
          subtitle="Un'iniziativa nata dall'incontro tra scuola, ricerca scientifica e attenzione al territorio della Lomellina."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Prose>
            <p>
              Il progetto ha preso avvio nell'<strong>estate del 2023</strong> grazie al
              finanziamento ottenuto attraverso il bando nazionale <strong>#iosonoAmbiente</strong>,
              promosso dal Ministero dell'Istruzione e del Merito in collaborazione con il
              Ministero dell'Ambiente e della Sicurezza Energetica e con il Ministero
              dell'Università e della Ricerca.
            </p>
            <p>
              L'adesione della nostra scuola, IIS Caramuel Roncalli di Vigevano, nasce da una riflessione sul
              territorio della <strong>Lomellina</strong>, area storicamente legata alla
              coltivazione del riso ma oggi esposta agli effetti della crisi climatica e
              alla crescente scarsità delle risorse idriche.
            </p>
          </Prose>
          <Prose>
            <p>
              Riferimenti concreti come la <strong>siccità dell'estate 2022</strong>, la
              riduzione della produzione risicola, il <strong>World Water Day del marzo 2023</strong>
              {" "}e il documento <em>«Drought in Europe»</em>.
            </p>
            <p>
              Da qui il collegamento ideale tra <strong>la montagna</strong>, luogo di
              origine delle risorse idriche, e <strong>la pianura</strong>, luogo del loro
              utilizzo agricolo.
            </p>
          </Prose>
        </div>
      </Section>

      {/* SECTION 2: OBIETTIVI */}
      <Section tone="alt">
        <SectionHeader
          eyebrow="02 — Finalità"
          title="Finalità e obiettivi"
          subtitle="Promuovere una consapevolezza scientificamente fondata delle problematiche legate al cambiamento climatico e alla gestione sostenibile dell'acqua, attraverso esperienze dirette, attività sperimentali e azioni di educazione ambientale rivolte al territorio."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Mountain className="h-5 w-5" />}
            title="Cambiamento climatico"
            text="Comprendere il legame tra riscaldamento globale, riduzione dei ghiacciai alpini e disponibilità idrica nel bacino del Po."
          />
          <FeatureCard
            icon={<Droplets className="h-5 w-5" />}
            title="Risparmio idrico"
            text="Sperimentare soluzioni innovative per ridurre il consumo di acqua in agricoltura attraverso la coltivazione idroponica."
          />
          <FeatureCard
            icon={<Microscope className="h-5 w-5" />}
            title="Ricerca scientifica"
            text="Avvicinare gli studenti alle pratiche della ricerca scientifica, anche in collaborazione con il mondo universitario."
          />
          <FeatureCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="Polo didattico"
            text="Costruire un polo didattico stabile, aperto alle scuole e alla cittadinanza, dedicato ad ambiente, sostenibilità e innovazione scientifica."
          />
        </div>
      </Section>

      {/* SECTION 3: TRE DIRETTRICI */}
      <Section>
        <SectionHeader
          eyebrow="03 — Le tre direttrici"
          title="Tre tappe, un unico percorso"
          subtitle="Dalla montagna alla pianura, fino alla restituzione alla nostra scuola."
        />
        <div className="mt-12 space-y-6">
          <DirectionCard
            number="01"
            icon={<Mountain className="h-6 w-6" />}
            title="La montagna: il Parco Nazionale dello Stelvio"
          >
            <p>
              La prima fase ha previsto un'esperienza formativa residenziale presso il
              <strong> Parco Nazionale dello Stelvio</strong>, con l'obiettivo di rendere
              gli studenti testimoni diretti degli effetti del cambiamento climatico
              sull'ambiente alpino.
            </p>
            <p>
              Nel <strong>settembre 2023</strong>, circa novanta studenti dell'IIS Caramuel
              Roncalli, accompagnati dai docenti, hanno partecipato a due giornate di
              attività curate dal personale del Parco: approfondimenti sulla storia, sulla
              biodiversità e sulla geomorfologia del territorio, oltre a un{" "}
              <strong>percorso glaciologico fino al fronte del ghiacciaio dei Forni</strong>.
              L'osservazione diretta del suo arretramento ha rappresentato un'esperienza di
              forte impatto formativo.
            </p>
          </DirectionCard>

          <DirectionCard
            number="02"
            icon={<Droplets className="h-6 w-6" />}
            title="La pianura: l'impianto idroponico e la sperimentazione scientifica"
          >
            <p>
              La seconda direttrice ha riguardato l'allestimento di un{" "}
              <strong>impianto idroponico indoor</strong> per la coltivazione del riso,
              coltura simbolo del territorio lomellino. La scelta dell'idroponica è motivata
              dalla possibilità di ridurre drasticamente il consumo di acqua, con un
              risparmio stimato tra l'<strong>80% e il 90%</strong> rispetto alla
              coltivazione tradizionale per sommersione, evitando inoltre l'uso di
              pesticidi e fitofarmaci.
            </p>
            <p>
              L'impianto è stato realizzato con il supporto scientifico del{" "}
              <strong>Dipartimento di Bioscienze dell'Università degli Studi di Milano</strong>.
              Dall'autunno 2024 gli studenti partecipano a laboratori pomeridiani dedicati
              alla gestione dell'impianto, alla coltivazione delle piante e alla progettazione di
              attività sperimentali.
            </p>
            <p>
              L'evoluzione del progetto ha portato allo sviluppo di ricerche di{" "}
              <strong>biologia molecolare</strong>, con studi sull'espressione genica in
              condizioni di stress salino su piante modello, culminate nella partecipazione a
              <strong> Science on Stage Italia</strong>, dove il lavoro è stato selezionato
              per la fase europea.
            </p>
          </DirectionCard>

          <DirectionCard
            number="03"
            icon={<Users className="h-6 w-6" />}
            title="A scuola: percorso didattico ed educazione ambientale"
          >
            <p>
              La terza direttrice ha riguardato la progettazione di un percorso didattico
              strutturato, finalizzato alla disseminazione dei risultati e delle conoscenze
              acquisite, attraverso una <strong>mostra multimediale</strong> e laboratori
              rivolti alle scuole del territorio, in particolare alle scuole secondarie di primo
              grado e primarie.
            </p>
            <p>
              Un momento centrale è stato il convegno <strong>GROWING KNOWLEDGE</strong>,
              svoltosi nell'<strong>aprile 2025</strong>, con la partecipazione di docenti,
              professori universitari, esperti ambientali e rappresentanti del mondo
              agricolo.
            </p>
          </DirectionCard>
        </div>
      </Section>

      {/* SECTION 4: VALORE FORMATIVO */}
      <Section tone="alt">
        <SectionHeader
          eyebrow="04 — Valore formativo"
          title="Valore formativo e impatto educativo"
          subtitle="Trasformare temi astratti in esperienze concrete, osservabili e sperimentabili."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Prose>
            <p>
              Il progetto ha trasformato temi spesso percepiti come astratti — cambiamento
              climatico, crisi idrica, sostenibilità ambientale — in esperienze concrete
              all'interno di un <strong>ambiente di apprendimento autentico</strong>.
            </p>
            <p>Gli studenti sono stati coinvolti:</p>
            <ul>
              <li>nella progettazione del sistema idroponico;</li>
              <li>nella gestione quotidiana dell'impianto;</li>
              <li>nella raccolta e analisi dei dati;</li>
              <li>nel controllo dell'acqua e dei nutrienti;</li>
              <li>nel monitoraggio della crescita delle piante.</li>
            </ul>
          </Prose>
          <Prose>
            <p>
              La gestione di un sistema idroponico richiede il controllo di{" "}
              <strong>pH, conducibilità, nutrienti</strong>, salute delle piante,
              prevenzione di contaminazioni biologiche e uso consapevole della tecnologia.
            </p>
            <p>
              Il progetto integra discipline <strong>STEM</strong> — chimica, biologia,
              scienze della Terra e tecnologia — e valorizza la <strong>peer education</strong>:
              gli studenti più grandi assumono il ruolo di tutor verso i più giovani,
              rendendo la scienza accessibile, concreta e condivisa.
            </p>
          </Prose>
        </div>
      </Section>

      {/* SECTION 5: RISULTATI */}
      <Section>
        <SectionHeader
          eyebrow="05 — Risultati"
          title="Risultati e ricadute"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="Competenze degli studenti"
            text="Sviluppo di competenze scientifiche, progettuali e comunicative, con un apprendimento attivo e consapevole."
          />
          <FeatureCard
            icon={<Microscope className="h-5 w-5" />}
            title="Ricerca e università"
            text="Sperimentazioni innovative e collaborazioni con il mondo universitario, in una pratica di ricerca autentica."
          />
          <FeatureCard
            icon={<Leaf className="h-5 w-5" />}
            title="Territorio"
            text="Sensibilizzazione della comunità locale sulla crisi climatica e modelli alternativi di uso dell'acqua in agricoltura."
          />
        </div>
      </Section>

      {/* SECTION 6: PROSPETTIVE */}
      <Section tone="alt">
        <SectionHeader
          eyebrow="06 — Prospettive future"
          title="Un percorso in evoluzione"
          subtitle="Il percorso avviato non è un'esperienza conclusa, ma un progetto in continua crescita."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            "Consolidamento del polo didattico",
            "Ampliamento delle attività di ricerca scientifica",
            "Rafforzamento delle attività di educazione ambientale",
            "Nuovi momenti di confronto pubblico e scientifico",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background p-5 shadow-[var(--shadow-soft)]"
            >
              <Sprout className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
              <p className="text-sm font-medium text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SECTION 7: CONCLUSIONE */}
      <Section>
        <div className="mx-auto max-w-3xl rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 text-center md:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            07 — Conclusione
          </span>
          <h2 className="mt-5 text-2xl font-bold text-primary md:text-3xl">
            Una scuola che coltiva sapere, territorio e responsabilità
          </h2>
          <p className="mt-5 text-base leading-relaxed text-foreground/85 italic">
            «Il progetto <em>‘GROWING KNOWLEDGE: buone pratiche nella coltivazione
            idroponica’</em> rappresenta un esempio di come la scuola possa farsi luogo di
            connessione tra sapere scientifico, territorio e responsabilità ambientale.
            Attraverso un percorso integrato che unisce esperienza diretta, sperimentazione
            e divulgazione, il progetto contribuisce a formare cittadini consapevoli e a
            promuovere una cultura della sostenibilità fondata sulla conoscenza e
            sull'azione.»
          </p>
        </div>
      </Section>

      {/* CTA */}
      <Section tone="alt">
        <SectionHeader
          eyebrow="Esplora"
          title="Scopri di più sul progetto"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <CtaCard
            to="/galleria"
            icon={<Camera className="h-6 w-6" />}
            title="Galleria foto"
            text="Sfoglia le immagini delle attività in laboratorio, in classe e sul territorio."
          />
          <CtaCard
            to="/video"
            icon={<PlayCircle className="h-6 w-6" />}
            title="Video del progetto"
            text="Guarda il racconto del laboratorio di idroponica e della sua evoluzione."
          />
        </div>
      </Section>
    </div>
  );
}

/* ---------- helpers ---------- */

function Section({
  children,
  tone,
  id,
}: {
  children: React.ReactNode;
  tone?: "alt";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={tone === "alt" ? "bg-muted/40" : ""}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">{children}</div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-foreground/85 [&_strong]:text-primary [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
      {children}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-border/70 bg-background p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-bold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/75">{text}</p>
    </div>
  );
}

function DirectionCard({
  number,
  icon,
  title,
  children,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 rounded-3xl border border-border/70 bg-background p-6 shadow-[var(--shadow-soft)] md:grid-cols-[auto_1fr] md:p-8">
      <div className="flex md:flex-col items-center md:items-start gap-4">
        <span className="text-4xl font-extrabold text-secondary/40">{number}</span>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-primary md:text-2xl">{title}</h3>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-foreground/85 [&_strong]:text-primary">
          {children}
        </div>
      </div>
    </div>
  );
}

function CtaCard({
  to,
  icon,
  title,
  text,
}: {
  to: "/galleria" | "/video";
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-5 rounded-2xl border border-border/70 bg-background p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
    >
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-primary">{title}</h3>
        <p className="mt-1 text-sm text-foreground/75">{text}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
