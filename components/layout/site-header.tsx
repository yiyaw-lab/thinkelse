"use client";

import { Menu, X } from "lucide-react";
import { type ReactNode, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-pool-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="/">
          <LogoLockup markSize={24} showSpark />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-pool-muted transition-colors hover:text-pool-ink"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {deployBadge}
          <a href={phoneHref} className="btn-pool hidden px-4 py-2 text-sm sm:inline-flex">
            Text HELLO
          </a>
          <button
            type="button"
            className="inline-flex rounded-lg p-2 text-pool-ink md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-pool-line bg-white px-6 py-4 md:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {LINKS.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-pool-ink hover:bg-pool-bg"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={phoneHref}
                className="btn-pool w-full text-sm"
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
