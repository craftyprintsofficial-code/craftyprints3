import { SITE_CONFIG } from "@/lib/admin-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] mt-20 py-10">
      <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--muted-foreground)]">
        <div>© {new Date().getFullYear()} {SITE_CONFIG.storeName}</div>
        <div>Printed with care, picked up at school.</div>
      </div>
    </footer>
  );
}
