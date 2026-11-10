"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { BarChart3, CalendarCheck, Clapperboard, Library, Plus } from "lucide-react";
import { cx } from "@/components/ui";

const PAGES = [
  { href: "/dare", label: "Today", title: "Today's 7 videos", icon: CalendarCheck },
  { href: "/dare/formats", label: "Formats", title: "Dare's formats", icon: Clapperboard },
  { href: "/dare/library", label: "Library", title: "Video library", icon: Library },
  { href: "/dare/analytics", label: "Analytics", title: "Analytics", icon: BarChart3 },
  { href: "/dare/mine", label: "My videos", title: "My videos", icon: Plus },
];

const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/** The Dare 210 website: its own header and navigation, no dashboard sidebar. */
export function DareSite({ children }: { children: ReactNode }) {
  const path = clean(usePathname() || "/dare");
  const page = PAGES.find((p) => p.href === path) ?? PAGES[0];

  useEffect(() => {
    document.title = `${page.title} · Dare 210`;
  }, [page.title]);

  return (
    <div className="min-h-[100dvh] bg-page">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-4 px-4 md:flex-nowrap md:px-6">
          <Link href="/dare" className="flex shrink-0 items-center gap-2 py-2.5 md:py-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-[13px] font-bold text-white">D</span>
            <span className="leading-tight">
              <span className="block text-[15px] font-semibold tracking-[-0.01em]">Dare 210</span>
              <span className="hidden text-[11px] text-muted sm:block">7 videos a day · 30 days</span>
            </span>
          </Link>
          <nav className="no-scrollbar -mx-2 -mb-px flex w-[calc(100%+1rem)] gap-1 overflow-x-auto md:mx-0 md:w-auto md:flex-1 md:justify-end" aria-label="Pages">
            {PAGES.map((p) => {
              const on = p.href === path;
              const Icon = p.icon;
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  aria-current={on ? "page" : undefined}
                  className={cx(
                    "flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-2.5 text-[14px] transition md:py-3.5",
                    on ? "border-ink font-medium text-ink" : "border-transparent text-muted hover:text-ink",
                  )}
                >
                  <Icon size={15} className="hidden sm:block" /> {p.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-6 md:px-6">{children}</main>

      <footer className="mx-auto max-w-[1180px] px-4 pb-10 pt-4 text-[12px] text-muted md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
          <span>Formats and example videos from Dare's campaign on Bounty, viral videos from DarkUGC and Instagram, collected Nov 10, 2026.</span>
          <Link href="/" className="hover:text-ink">
            Dremedia dashboard →
          </Link>
        </div>
      </footer>
    </div>
  );
}

export function PageTitle({ title, sub, children }: { title: string; sub?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[26px] font-semibold tracking-[-0.015em]">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-sm text-muted">{sub}</p>}
      </div>
      {children}
    </div>
  );
}
