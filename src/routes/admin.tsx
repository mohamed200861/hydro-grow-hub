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
      </div>

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

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files ?? []));
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
