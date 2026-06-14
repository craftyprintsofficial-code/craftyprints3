import { Link } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";

export type CollectionTheme = { bg: string; accent: string; text: string };

export type CollectionTileData = {
  id: string;
  slug: string;
  name: string;
  theme_light: CollectionTheme;
  theme_dark: CollectionTheme;
  productCount?: number;
};

export function CollectionButton({ c }: { c: CollectionTileData }) {
  const { theme } = useTheme();
  const t = theme === "dark" ? c.theme_dark : c.theme_light;

  // Pre-position sparkles around the tile edges.
  const sparkles = [
    { top: "10%", left: "6%", d: "0ms" },
    { top: "18%", right: "8%", d: "120ms" },
    { top: "70%", left: "10%", d: "240ms" },
    { top: "78%", right: "12%", d: "60ms" },
    { top: "42%", left: "-2%", d: "180ms" },
    { top: "50%", right: "-2%", d: "300ms" },
    { top: "-4%", left: "45%", d: "90ms" },
    { top: "94%", left: "55%", d: "210ms" },
  ];

  return (
    <Link
      to="/collections/$slug"
      params={{ slug: c.slug }}
      className="collection-tile group relative isolate flex items-center justify-center overflow-visible rounded-[24px] p-8 min-h-[180px] md:min-h-[200px] border transition-transform duration-300 ease-out will-change-transform"
      style={{
        background: `linear-gradient(135deg, ${t.bg}, color-mix(in oklab, ${t.accent} 35%, ${t.bg}))`,
        color: t.text,
        borderColor: `color-mix(in oklab, ${t.accent} 60%, transparent)`,
        boxShadow: `0 10px 30px -12px color-mix(in oklab, ${t.accent} 50%, transparent)`,
      }}
    >
      <div className="text-center relative z-10">
        <div className="text-[10px] uppercase tracking-[0.18em] opacity-70 mb-2">Collection</div>
        <div className="text-2xl md:text-3xl font-bold leading-tight">{c.name}</div>
        {typeof c.productCount === "number" && (
          <div className="text-xs opacity-80 mt-2">
            {c.productCount} item{c.productCount === 1 ? "" : "s"}
          </div>
        )}
      </div>

      {sparkles.map((s, i) => (
        <span
          key={i}
          className="sparkle pointer-events-none absolute opacity-0 group-hover:opacity-100"
          style={{
            ...s,
            color: t.accent,
            animationDelay: s.d,
          }}
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0l2.39 9.61L24 12l-9.61 2.39L12 24l-2.39-9.61L0 12l9.61-2.39z" />
          </svg>
        </span>
      ))}
    </Link>
  );
}
