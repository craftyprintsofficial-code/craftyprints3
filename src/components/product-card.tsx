import { Link } from "@tanstack/react-router";
import { availabilityClass, getAvailabilityLabel, formatPrice } from "@/lib/format";
import { Star } from "lucide-react";
import { getActiveDiscount, applyDiscount } from "@/lib/discount";
import { DiscountBanner } from "@/components/discount-banner";

export type ProductCardData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price_cents: number;
  image_url: string | null;
  tags: string[];
  colors: { name: string; hex: string }[];
  availability: "in_stock" | "made_to_order" | "out_of_stock";
  out_of_stock_label?: string | null;
  discount_name?: string | null;
  discount_percent?: number | null;
  discount_starts_at?: string | null;
  discount_ends_at?: string | null;
  avgRating?: number;
  reviewCount?: number;
};

export function ProductCard({ p }: { p: ProductCardData }) {
  const firstHex = p.colors?.[0]?.hex ?? "#bdf28f";
  const discount = getActiveDiscount(p);
  const displayedPrice = discount ? applyDiscount(p.price_cents, discount.percent) : p.price_cents;

  return (
    <Link
      to="/products/$slug"
      params={{ slug: p.slug }}
      className="card-surface card-hoverable p-4 flex flex-col group"
    >
      <div
        className="aspect-square w-full rounded-[12px] mb-4 overflow-hidden flex items-center justify-center relative"
        style={{
          background: p.image_url
            ? undefined
            : `radial-gradient(120% 120% at 30% 20%, ${firstHex}55, transparent 60%), var(--secondary)`,
        }}
      >
        {p.image_url ? (
          <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div
            className="w-20 h-20 rounded-2xl"
            style={{ background: firstHex, boxShadow: `0 8px 24px -8px ${firstHex}` }}
          />
        )}
        <span className={`badge ${availabilityClass[p.availability]} absolute top-3 left-3`}>
          {getAvailabilityLabel(p.availability, p.out_of_stock_label)}
        </span>
        {discount && (
          <DiscountBanner name={discount.name} percent={discount.percent} endsAt={discount.endsAt} />
        )}
      </div>

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-tight">{p.title}</h3>
        <span className="font-bold text-sm whitespace-nowrap">
          {discount ? (
            <>
              <span className="line-through text-[var(--muted-foreground)] font-normal mr-1">
                {formatPrice(p.price_cents)}
              </span>
              From {formatPrice(displayedPrice)}
            </>
          ) : (
            <>From {formatPrice(p.price_cents)}</>
          )}
        </span>
      </div>

      <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">{p.description}</p>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {!!p.reviewCount && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <Star size={12} className="fill-[var(--mint)] stroke-[var(--mint)]" />
            {p.avgRating?.toFixed(1)} ({p.reviewCount})
          </span>
        )}
      </div>
    </Link>
  );
}
