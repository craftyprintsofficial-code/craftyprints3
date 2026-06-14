import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CartColorSelection = { setName: string; colorName: string; colorHex: string };

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  unitPriceCents: number;
  colorName: string | null;
  colorHex: string | null;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  imageUrl?: string | null;
  colorSelections?: CartColorSelection[] | null;
};

type CartKey = {
  productId: string;
  variantId: string | null;
  colorName: string | null;
  colorSelections?: CartColorSelection[] | null;
};

export function colorSelectionsSig(sel?: CartColorSelection[] | null): string {
  if (!sel || !sel.length) return "";
  return sel
    .slice()
    .sort((a, b) => a.setName.localeCompare(b.setName))
    .map((s) => `${s.setName}=${s.colorName}`)
    .join("|");
}

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (k: CartKey) => void;
  setQuantity: (k: CartKey, qty: number) => void;
  clear: () => void;
  totalCents: number;
  itemCount: number;
  bumpCounter: number;
};

const Ctx = createContext<CartCtx | null>(null);
const BASE_KEY = "pl-cart";
const guestKey = () => `${BASE_KEY}:guest`;
const userKey = (email: string) => `${BASE_KEY}:u:${email.toLowerCase()}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [bumpCounter, setBump] = useState(0);
  const storageKeyRef = useRef<string>(guestKey());
  const hydratedRef = useRef(false);

  const loadFor = (key: string) => {
    storageKeyRef.current = key;
    try {
      const raw = localStorage.getItem(key);
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
    hydratedRef.current = true;
  };

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email;
      loadFor(email ? userKey(email) : guestKey());
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const email = session?.user?.email;
      loadFor(email ? userKey(email) : guestKey());
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(storageKeyRef.current, JSON.stringify(items));
    } catch {}
  }, [items]);


  const matches = (a: CartItem, k: CartKey) =>
    a.productId === k.productId &&
    (a.variantId ?? null) === (k.variantId ?? null) &&
    (a.colorName ?? null) === (k.colorName ?? null) &&
    colorSelectionsSig(a.colorSelections) === colorSelectionsSig(k.colorSelections);

  const add: CartCtx["add"] = (item) => {
    setItems((cur) => {
      const idx = cur.findIndex((i) =>
        matches(i, {
          productId: item.productId,
          variantId: item.variantId,
          colorName: item.colorName,
          colorSelections: item.colorSelections,
        }),
      );
      if (idx >= 0) {
        const next = [...cur];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...cur, item];
    });
    setBump((n) => n + 1);
  };

  const remove: CartCtx["remove"] = (k) =>
    setItems((cur) => cur.filter((i) => !matches(i, k)));

  const setQuantity: CartCtx["setQuantity"] = (k, qty) =>
    setItems((cur) =>
      cur
        .map((i) => (matches(i, k) ? { ...i, quantity: qty } : i))
        .filter((i) => i.quantity > 0),
    );

  const totalCents = items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQuantity, clear: () => setItems([]), totalCents, itemCount, bumpCounter }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("CartProvider missing");
  return c;
};
