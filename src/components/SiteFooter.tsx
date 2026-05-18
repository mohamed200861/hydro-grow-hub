import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs sm:flex-row md:px-8">
        <p>© 2026 Growing Knowledge — IIS Caramuel Roncalli, Vigevano</p>
        <Link to="/contatti" className="opacity-80 hover:underline">Contatti</Link>
      </div>
    </footer>
  );
}
