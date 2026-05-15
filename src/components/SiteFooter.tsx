import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs sm:flex-row md:px-8">
        <p>© 2026 Growing Knowledge — IIS Caramuel Roncalli, Vigevano</p>
        <div className="flex items-center gap-4 opacity-80">
          <Link to="/contatti" className="hover:underline">Contatti</Link>
          <Link to="/admin" className="hover:underline">Area riservata</Link>
        </div>
      </div>
    </footer>
  );
}
