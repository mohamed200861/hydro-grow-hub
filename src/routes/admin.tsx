import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
  Eye,
  EyeOff,
  Pencil,
  LogOut,
  Upload,
  Check,
  X,
  Home as HomeIcon,
  Trophy,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Area riservata — Growing Knowledge" }] }),
  component: AdminGate,
});

function AdminGate() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">Caricamento…</div>;
  }
  if (!user) return null;

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-primary">Accesso non autorizzato</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Il tuo account non ha i permessi di amministratore.
        </p>
        <button
          onClick={() => signOut()}
          className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Disconnetti
        </button>
        <div className="mt-3">
          <Link to="/" className="text-xs text-muted-foreground hover:underline">
            ← Torna alla home
          </Link>
        </div>
      </section>
    );
  }

  return <AdminDashboard />;
}

interface MediaRow {
  id: string;
  title: string | null;
  description: string | null;
  file_url: string;
  file_path: string;
  file_type: string;
  mime_type: string | null;
  size: number | null;
  is_published: boolean;
  created_at: string;
}

function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [items, setItems] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("media_files")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems(data ?? []);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary md:text-3xl">Area riservata</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connesso come <span className="font-medium text-foreground">{user?.email}</span>
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> Disconnetti
        </button>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <PhotoUploader onUploaded={load} userId={user!.id} />
        <VideoUploader onUploaded={load} userId={user!.id} />
        <HeroUploader onUploaded={load} userId={user!.id} />
      </div>

      <RecognitionsManager userId={user!.id} />


      <section className="mt-10">
        <h2 className="text-xl font-bold text-primary">Contenuti caricati</h2>
        <p className="text-sm text-muted-foreground">
          Pubblica, nascondi, modifica o elimina i contenuti.
        </p>
        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Caricamento…</p>
        ) : items.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
            Nessun contenuto caricato.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MediaCard key={item.id} item={item} onChange={load} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PhotoUploader({ onUploaded, userId }: { onUploaded: () => void; userId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  const MAX_PHOTO = 50 * 1024 * 1024; // 50 MB

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const tooBig = picked.filter((f) => f.size > MAX_PHOTO);
    if (tooBig.length) {
      toast.error(`Alcuni file superano 50 MB e non saranno caricati: ${tooBig.map((f) => f.name).join(", ")}`);
    }
    setFiles(picked.filter((f) => f.size <= MAX_PHOTO));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!files.length) return;
    setBusy(true);
    let okCount = 0;
    for (const file of files) {
      const path = `images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitize(file.name)}`;
      const up = await supabase.storage.from("project-media").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (up.error) {
        toast.error(`Errore upload "${file.name}": ${up.error.message}`);
        continue;
      }
      const { data: pub } = supabase.storage.from("project-media").getPublicUrl(path);
      const ins = await supabase.from("media_files").insert({
        title: title || null,
        description: description || null,
        file_path: path,
        file_url: pub.publicUrl,
        file_type: "image",
        mime_type: file.type,
        size: file.size,
        is_published: true,
        uploaded_by: userId,
      });
      if (ins.error) {
        toast.error(ins.error.message);
        continue;
      }
      okCount++;
    }
    setBusy(false);
    if (okCount > 0) {
      toast.success(`${okCount} foto caricate`);
      setFiles([]);
      setTitle("");
      setDescription("");
      (document.getElementById("photoInput") as HTMLInputElement).value = "";
      onUploaded();
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-border/70 bg-background p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <ImageIcon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-primary">Carica foto</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">JPG, PNG o WEBP — selezione multipla supportata.</p>

      <input
        id="photoInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={onPick}
        className="mt-4 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground hover:file:opacity-90"
      />

      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {files.map((f, i) => (
            <img
              key={i}
              src={URL.createObjectURL(f)}
              alt={f.name}
              className="aspect-square w-full rounded-lg border border-border object-cover"
            />
          ))}
        </div>
      )}

      <input
        type="text"
        placeholder="Titolo (opzionale)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />
      <textarea
        placeholder="Descrizione (opzionale)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      <button
        type="submit"
        disabled={busy || !files.length}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        {busy ? "Caricamento…" : "Carica foto"}
      </button>
    </form>
  );
}

function VideoUploader({ onUploaded, userId }: { onUploaded: () => void; userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    const path = `videos/${Date.now()}-${sanitize(file.name)}`;
    const up = await supabase.storage.from("project-media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (up.error) {
      toast.error(up.error.message);
      setBusy(false);
      return;
    }
    const { data: pub } = supabase.storage.from("project-media").getPublicUrl(path);
    const ins = await supabase.from("media_files").insert({
      title: title || null,
      description: description || null,
      file_path: path,
      file_url: pub.publicUrl,
      file_type: "video",
      mime_type: file.type,
      size: file.size,
      is_published: true,
      uploaded_by: userId,
    });
    setBusy(false);
    if (ins.error) {
      toast.error(ins.error.message);
      return;
    }
    toast.success("Video caricato");
    setFile(null);
    setTitle("");
    setDescription("");
    (document.getElementById("videoInput") as HTMLInputElement).value = "";
    onUploaded();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-border/70 bg-background p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-accent text-primary-foreground">
          <VideoIcon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-primary">Carica video</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">MP4, WEBM o MOV — un file per volta.</p>

      <input
        id="videoInput"
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mt-4 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-secondary-foreground hover:file:opacity-90"
      />

      {file && (
        <video
          src={URL.createObjectURL(file)}
          controls
          className="mt-3 aspect-video w-full rounded-xl border border-border bg-black"
        />
      )}

      <input
        type="text"
        placeholder="Titolo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />
      <textarea
        placeholder="Descrizione"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      <button
        type="submit"
        disabled={busy || !file}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground hover:opacity-90 disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        {busy ? "Caricamento…" : "Carica video"}
      </button>
    </form>
  );
}

function MediaCard({ item, onChange }: { item: MediaRow; onChange: () => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title ?? "");
  const [description, setDescription] = useState(item.description ?? "");

  async function togglePublish() {
    const { error } = await supabase
      .from("media_files")
      .update({ is_published: !item.is_published })
      .eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success(!item.is_published ? "Pubblicato" : "Nascosto");
    onChange();
  }

  async function remove() {
    if (!confirm("Eliminare definitivamente questo contenuto?")) return;
    await supabase.storage.from("project-media").remove([item.file_path]);
    const { error } = await supabase.from("media_files").delete().eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success("Contenuto eliminato");
    onChange();
  }

  async function saveEdit() {
    const { error } = await supabase
      .from("media_files")
      .update({ title: title || null, description: description || null })
      .eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success("Modifiche salvate");
    setEditing(false);
    onChange();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background shadow-[var(--shadow-soft)]">
      {item.file_type === "image" ? (
        <img src={item.file_url} alt={item.title ?? ""} className="aspect-video w-full object-cover" />
      ) : (
        <video src={item.file_url} className="aspect-video w-full bg-black" controls />
      )}

      <div className="p-4">
        {editing ? (
          <div className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titolo"
              className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrizione"
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
            />
            <div className="flex gap-2">
              <button onClick={saveEdit} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <Check className="h-3 w-3" /> Salva
              </button>
              <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs">
                <X className="h-3 w-3" /> Annulla
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-primary">{item.title || <span className="text-muted-foreground italic">Senza titolo</span>}</p>
            {item.description && <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>}
            <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              {item.file_type === "image" ? "Immagine" : "Video"} · {new Date(item.created_at).toLocaleDateString("it-IT")} ·{" "}
              {item.is_published ? <span className="text-secondary">Pubblicato</span> : <span className="text-destructive">Nascosto</span>}
            </p>
          </>
        )}

        {!editing && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              onClick={togglePublish}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs hover:bg-muted"
            >
              {item.is_published ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {item.is_published ? "Nascondi" : "Pubblica"}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs hover:bg-muted"
            >
              <Pencil className="h-3 w-3" /> Modifica
            </button>
            <button
              onClick={remove}
              className="inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-background px-3 py-1 text-xs text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" /> Elimina
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function sanitize(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

// ============================================================
// HERO image uploader (homepage main photo)
// ============================================================
function HeroUploader({ onUploaded, userId }: { onUploaded: () => void; userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    void supabase
      .from("media_files")
      .select("file_url")
      .eq("file_type", "hero")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setCurrent(data?.file_url ?? null));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Il file supera 50 MB.");
      return;
    }
    setBusy(true);
    const path = `hero/${Date.now()}-${sanitize(file.name)}`;
    const up = await supabase.storage.from("project-media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (up.error) {
      toast.error(up.error.message);
      setBusy(false);
      return;
    }
    const { data: pub } = supabase.storage.from("project-media").getPublicUrl(path);
    // Unpublish previous hero(s) so the latest one wins
    await supabase
      .from("media_files")
      .update({ is_published: false })
      .eq("file_type", "hero");
    const ins = await supabase.from("media_files").insert({
      title: "Hero image",
      file_path: path,
      file_url: pub.publicUrl,
      file_type: "hero",
      mime_type: file.type,
      size: file.size,
      is_published: true,
      uploaded_by: userId,
    });
    setBusy(false);
    if (ins.error) return toast.error(ins.error.message);
    toast.success("Foto della Home aggiornata");
    setCurrent(pub.publicUrl);
    setFile(null);
    (document.getElementById("heroInput") as HTMLInputElement).value = "";
    onUploaded();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-border/70 bg-background p-6 shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
          <HomeIcon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-primary">Foto della Home (hero)</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Sostituisce l'immagine principale della Home. La nuova foto diventa attiva subito.
      </p>

      {(file || current) && (
        <img
          src={file ? URL.createObjectURL(file) : current!}
          alt="Anteprima hero"
          className="mt-4 aspect-[4/5] w-full rounded-xl border border-border object-cover"
        />
      )}

      <input
        id="heroInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mt-4 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground hover:file:opacity-90"
      />

      <button
        type="submit"
        disabled={busy || !file}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        {busy ? "Caricamento…" : "Aggiorna foto Home"}
      </button>
    </form>
  );
}

// ============================================================
// Recognitions manager
// ============================================================
interface RecognitionRow {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  image_path: string | null;
  is_published: boolean;
  created_at: string;
}

function RecognitionsManager({ userId }: { userId: string }) {
  const [items, setItems] = useState<RecognitionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("recognitions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">Gestione riconoscimenti</h2>
            <p className="text-sm text-muted-foreground">
              Aggiungi, modifica o elimina premi ed eventi mostrati su /riconoscimenti.
            </p>
          </div>
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          {creating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {creating ? "Annulla" : "Nuovo riconoscimento"}
        </button>
      </div>

      {creating && (
        <div className="mt-5">
          <RecognitionForm
            userId={userId}
            onDone={() => {
              setCreating(false);
              void load();
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Caricamento…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
          Nessun riconoscimento creato.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <RecognitionCard key={r.id} item={r} onChange={load} />
          ))}
        </div>
      )}
    </section>
  );
}

function RecognitionForm({
  userId,
  initial,
  onDone,
}: {
  userId: string;
  initial?: RecognitionRow;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Inserisci un titolo");
    setBusy(true);
    let image_url = initial?.image_url ?? null;
    let image_path = initial?.image_path ?? null;

    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Il file supera 50 MB.");
        setBusy(false);
        return;
      }
      const path = `recognitions/${Date.now()}-${sanitize(file.name)}`;
      const up = await supabase.storage.from("project-media").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (up.error) {
        toast.error(up.error.message);
        setBusy(false);
        return;
      }
      // remove previous image if replacing
      if (initial?.image_path) {
        await supabase.storage.from("project-media").remove([initial.image_path]);
      }
      image_path = path;
      image_url = supabase.storage.from("project-media").getPublicUrl(path).data.publicUrl;
    }

    if (initial) {
      const { error } = await supabase
        .from("recognitions")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          image_url,
          image_path,
        })
        .eq("id", initial.id);
      if (error) {
        toast.error(error.message);
        setBusy(false);
        return;
      }
      toast.success("Riconoscimento aggiornato");
    } else {
      const { error } = await supabase.from("recognitions").insert({
        title: title.trim(),
        description: description.trim() || null,
        image_url,
        image_path,
        is_published: true,
        uploaded_by: userId,
      });
      if (error) {
        toast.error(error.message);
        setBusy(false);
        return;
      }
      toast.success("Riconoscimento creato");
    }
    setBusy(false);
    onDone();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-2xl border border-border/70 bg-muted/40 p-5 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-foreground/80">Titolo</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={150}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          placeholder="Es. Science on Stage Italia 2024"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-foreground/80">Descrizione breve</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          maxLength={1000}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          placeholder="Una frase che descrive il riconoscimento"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-foreground/80">Immagine</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground hover:file:opacity-90"
        />
        {(file || initial?.image_url) && (
          <img
            src={file ? URL.createObjectURL(file) : initial!.image_url!}
            alt="Anteprima"
            className="mt-3 aspect-[5/4] w-full max-w-xs rounded-xl border border-border object-cover"
          />
        )}
      </div>
      <div className="sm:col-span-2 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          {busy ? "Salvataggio…" : initial ? "Salva modifiche" : "Crea riconoscimento"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2 text-sm font-medium hover:bg-muted"
        >
          <X className="h-4 w-4" /> Annulla
        </button>
      </div>
    </form>
  );
}

function RecognitionCard({ item, onChange }: { item: RecognitionRow; onChange: () => void }) {
  const [editing, setEditing] = useState(false);

  async function togglePublish() {
    const { error } = await supabase
      .from("recognitions")
      .update({ is_published: !item.is_published })
      .eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success(!item.is_published ? "Pubblicato" : "Nascosto");
    onChange();
  }

  async function remove() {
    if (!confirm("Eliminare definitivamente questo riconoscimento?")) return;
    if (item.image_path) {
      await supabase.storage.from("project-media").remove([item.image_path]);
    }
    const { error } = await supabase.from("recognitions").delete().eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success("Riconoscimento eliminato");
    onChange();
  }

  if (editing) {
    return (
      <div className="sm:col-span-2 lg:col-span-3">
        <RecognitionForm
          userId={item.id}
          initial={item}
          onDone={() => {
            setEditing(false);
            onChange();
          }}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background shadow-[var(--shadow-soft)]">
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} className="aspect-[5/4] w-full object-cover" />
      ) : (
        <div className="flex aspect-[5/4] w-full items-center justify-center bg-muted text-muted-foreground">
          <Trophy className="h-8 w-8" />
        </div>
      )}
      <div className="p-4">
        <p className="text-sm font-semibold text-primary">{item.title}</p>
        {item.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        )}
        <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          {new Date(item.created_at).toLocaleDateString("it-IT")} ·{" "}
          {item.is_published ? (
            <span className="text-secondary">Pubblicato</span>
          ) : (
            <span className="text-destructive">Nascosto</span>
          )}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            onClick={togglePublish}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs hover:bg-muted"
          >
            {item.is_published ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {item.is_published ? "Nascondi" : "Pubblica"}
          </button>
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs hover:bg-muted"
          >
            <Pencil className="h-3 w-3" /> Modifica
          </button>
          <button
            onClick={remove}
            className="inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-background px-3 py-1 text-xs text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3 w-3" /> Elimina
          </button>
        </div>
      </div>
    </div>
  );
}
