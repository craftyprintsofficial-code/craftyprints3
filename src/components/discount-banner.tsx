import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/discount";

export function DiscountBanner({
  name,
  percent,
  endsAt,
  className = "",
}: {
  name: string;
  percent: number;
  endsAt: Date;
  className?: string;
}) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (endsAt.getTime() <= now) return null;

  return (
    <div
      className={`absolute left-0 right-0 bottom-0 px-3 py-1.5 text-white text-xs font-semibold flex items-center justify-between gap-2 ${className}`}
      style={{
        background: "linear-gradient(90deg, #16a34a, #22c55e)",
        boxShadow: "0 -4px 12px -4px rgba(0,0,0,0.25)",
      }}
    >
      <span className="truncate">
        <span className="mr-1">{name}</span>
        <span>−{percent}% OFF</span>
      </span>
      <span className="font-mono tabular-nums whitespace-nowrap">
        {formatCountdown(endsAt, now)}
      </span>
    </div>
  );
}
