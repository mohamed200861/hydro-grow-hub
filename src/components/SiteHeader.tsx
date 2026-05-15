import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/galleria", label: "Galleria" },
  { to: "/video", label: "Video" },
  { to: "/contatti", label: "Contatti" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Logo Growing Knowledge"
            className="h-12 w-12 object-contain transition-transform group-hover:scale-105"
          />
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-bold tracking-wide text-primary">GROWING KNOWLEDGE</p>
            <p className="text-xs text-muted-foreground">IIS Caramuel Roncalli</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 rounded-full text-sm font-medium text-foreground/75 hover:text-primary hover:bg-muted transition-colors"
              activeProps={{ className: "px-4 py-2 rounded-full text-sm font-semibold text-primary bg-muted" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-full p-2 text-primary hover:bg-muted"
          aria-label="Apri menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border/60 bg-background">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted"
                activeProps={{ className: "px-4 py-3 rounded-lg text-sm font-semibold text-primary bg-muted" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
