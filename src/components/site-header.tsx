import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBasket, User as UserIcon, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import { useCart } from "./cart-provider";
import { useAuth } from "./auth-provider";
import { SITE_CONFIG } from "@/lib/admin-config";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { itemCount, bumpCounter } = useCart();
  const { user, avatarUrl } = useAuth();
  const [bump, setBump] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    if (bumpCounter === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 500);
    return () => clearTimeout(t);
  }, [bumpCounter]);

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className="text-sm font-medium px-3 py-1.5 rounded-full transition-colors hover:bg-[var(--mint-soft)]"
      activeProps={{ className: "text-sm font-medium px-3 py-1.5 rounded-full bg-[var(--mint-soft)]" }}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_82%,transparent)]">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-4">
        {/* Theme toggle - top left */}
        <button
          aria-label="Toggle theme"
          onClick={toggle}
          className="theme-toggle shrink-0"
        >
          <span className="theme-toggle-thumb">
            {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
          </span>
        </button>

        <Link to="/" className="font-bold text-lg tracking-tight ml-1">
          {SITE_CONFIG.storeName}
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {navLink("/", "Home")}
          {navLink("/products", "Shop")}
        </nav>

        <div className="flex-1" />

        <Link to="/cart" className="btn-icon" aria-label="Basket">
          <ShoppingBasket size={18} className={bump ? "cart-bump" : ""} />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[var(--mint)] text-[var(--primary-foreground)] text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border border-[var(--background)]">
              {itemCount}
            </span>
          )}
        </Link>

        <Link to={user ? "/account" : "/login"} className="btn-icon overflow-hidden p-0" aria-label="Account">
          {user && avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
          ) : (
            <UserIcon size={18} />
          )}
        </Link>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex items-center justify-center gap-2 pb-3 px-5">
        {navLink("/", "Home")}
        {navLink("/products", "Shop")}
      </nav>

      {/* underline to indicate route activity */}
      <div key={location.pathname} className="h-[1px]" />
    </header>
  );
}
