"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { asset } from "@/lib/mock";
import { SNAPSHOT_DATE } from "@/lib/ugc";
import { cx } from "@/components/ui";
import { ThemeProvider, ThemeToggle } from "./theme";

export const PAGES = [
  { href: "/ugc", label: "Discover", title: "Discover viral UGC" },
  { href: "/ugc/viral", label: "Going viral", title: "Going viral" },
  { href: "/ugc/scripts", label: "Scripts", title: "Scripts" },
  { href: "/ugc/plan", label: "Plan", title: "Today's 7 videos" },
  { href: "/ugc/analytics", label: "Analytics", title: "Analytics" },
  { href: "/ugc/download", label: "Download", title: "Video downloader" },
  { href: "/ugc/saved", label: "Saved", title: "Saved videos" },
];

const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
const isOn = (path: string, href: string) => (href === "/ugc" ? path === "/ugc" : path === href || path.startsWith(href + "/"));

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx("relative block", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/brand/logo-black.png")} alt="Dremedia" width={671} height={193} className="logo-on-light h-full w-auto" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/brand/logo-white.png")} alt="Dremedia" width={671} height={193} className="logo-on-dark h-full w-auto" />
    </span>
  );
}

/** The Dremedia site: its own header, pill navigation and day/night switch. */
export function UgcSite({ children }: { children: ReactNode }) {
  const path = clean(usePathname() || "/ugc");
  const page = PAGES.find((p) => isOn(path, p.href));

  useEffect(() => {
    if (page) document.title = `${page.title} · Dremedia`;
  }, [page]);

  return (
    <ThemeProvider>
      <div className="dm min-h-[100dvh] bg-dm-bg text-dm-ink">
        <header className="sticky top-0 z-30 border-b border-dm-line/70 bg-dm-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-dm-bg/70">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-4 px-4 pt-2.5 md:flex-nowrap md:px-6 md:py-3">
            <Link href="/ugc" className="flex h-10 shrink-0 items-center py-1 md:h-11" aria-label="Dremedia home">
              <Logo className="h-full" />
            </Link>
            <ThemeToggle className="md:order-3" />
            <nav
              aria-label="Pages"
              className="no-scrollbar -mx-4 mt-2 flex w-[calc(100%+2rem)] gap-1 overflow-x-auto px-4 pb-2.5 md:order-2 md:mx-0 md:mt-0 md:w-auto md:justify-center md:rounded-full md:border md:border-dm-line md:bg-dm-surface md:p-1"
            >
              {PAGES.map((p) => {
                const on = isOn(path, p.href);
                return (
                  <Link
                    key={p.href}
                    href={p.href}
                    aria-current={on ? "page" : undefined}
                    className={cx(
                      "shrink-0 rounded-full px-3.5 py-1.5 text-[14px] transition",
                      on ? "bg-dm-accent font-medium text-dm-accent-fg" : "text-dm-muted hover:bg-dm-surface2 hover:text-dm-ink",
                    )}
                  >
                    {p.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-[1240px] px-4 py-6 md:px-6 md:py-8">{children}</main>

        <footer className="mx-auto max-w-[1240px] px-4 pb-10 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dm-line pt-5 text-[12px] text-dm-muted">
            <div className="flex items-center gap-3">
              <Logo className="h-5 opacity-80" />
              <span>Viral video data from DarkUGC, updated {new Date(SNAPSHOT_DATE + "T12:00:00").toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}.</span>
            </div>
            <Link href="/" className="hover:text-dm-ink">
              Dashboard →
            </Link>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export function PageHead({ title, sub, eyebrow, children }: { title: ReactNode; sub?: ReactNode; eyebrow?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <div className="mb-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-dm-muted">{eyebrow}</div>}
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] md:text-[34px]">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-dm-muted">{sub}</p>}
      </div>
      {children}
    </div>
  );
}
