import { Star } from "lucide-react";
import { useState } from "react";

export function StarRating({
  value, onChange, size = 18, readOnly = false,
}: { value: number; onChange?: (v: number) => void; size?: number; readOnly?: boolean }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className="inline-flex items-center gap-0.5" role={readOnly ? undefined : "radiogroup"}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= display;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(n)}
            className="p-0.5 transition-transform hover:scale-110 disabled:cursor-default"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star
              size={size}
              strokeWidth={1.5}
              className={active ? "fill-[var(--mint)] stroke-[var(--mint)]" : "stroke-[var(--muted-foreground)]"}
            />
          </button>
        );
      })}
    </div>
  );
}
