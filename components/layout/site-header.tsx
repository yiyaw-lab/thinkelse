"use client";

import { Menu, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { LogoLockup } from "@/components/brand/logo-lockup";

const LINKS = [
  ["How it works", "#how"],
  ["Quests", "#quests"],
  ["Why Else", "#why"],
] as const;

type SiteHeaderProps = {
  phoneHref: string;
  deployBadge: ReactNode;
};

export function SiteHeader({ phoneHref, deployBadge }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const light = scrolled;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        light
          ? "border-border-soft bg-cream-50/92 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="/">
          <LogoLockup markSize={26} inverted={!light} showSpark />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                light
                  ? "text-muted hover:text-ink-800"
                  : "text-violet-300 hover:text-cream-50"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {deployBadge}
          <a
            href={phoneHref}
            className="btn-primary hidden px-4 py-2 text-sm sm:inline-flex"
          >
            Text HELLO
          </a>
          <button
            type="button"
            className={`inline-flex rounded-lg p-2 md:hidden ${
              light ? "text-ink-800" : "text-cream-50"
            }`}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-border-soft bg-cream-50 px-6 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {LINKS.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-rose-100/50"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={phoneHref}
                className="btn-primary w-full text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Text HELLO
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
