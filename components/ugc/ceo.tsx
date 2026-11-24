"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { cx } from "@/components/ui";
import { PHASES, START, addDays, dayN, doneShare, nice, phaseOf, weekStart, type Ceo } from "@/lib/ceo";

export const CEO_TABS = [
  { href: "/ugc/ceo", label: "Overview" },
  { href: "/ugc/ceo/ugc", label: "UGC" },
  { href: "/ugc/ceo/crm", label: "Brand CRM" },
  { href: "/ugc/ceo/creators", label: "Creators" },
  { href: "/ugc/ceo/agency", label: "Agency" },
  { href: "/ugc/ceo/divisions", label: "Divisions" },
  { href: "/ugc/ceo/money", label: "Money" },
  { href: "/ugc/ceo/plan", label: "Plan" },
  { href: "/ugc/ceo/review", label: "Weekly review" },
  { href: "/ugc/ceo/academy", label: "Academy" },
];

/** the CEO office's own tabs, under the site's main navigation */
export function CeoNav() {
  const path = (usePathname() || "/ugc/ceo").replace(/\/+$/, "");
  return (
    <nav aria-label="CEO office" className="no-scrollbar -mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-dm-line px-4 md:mx-0 md:px-0">
      {CEO_TABS.map((t) => {
        const on = path === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={on ? "page" : undefined}
            className={cx("-mb-px shrink-0 border-b-2 px-3 py-2.5 text-[14px] transition", on ? "border-dm-ink font-semibold text-dm-ink" : "border-transparent text-dm-muted hover:text-dm-ink")}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** the masthead every CEO page shares: day counter, phase, date */
export function CeoHead({ today, title, sub, children }: { today: string; title: ReactNode; sub?: ReactNode; children?: ReactNode }) {
  const n = dayN(today), ph = phaseOf(n);
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="mb-1.5 text-[13px] text-dm-muted">
          {n < 1 ? `Plan starts ${nice(START)}` : n > 90 ? "90 days complete" : `Day ${n} of 90 · Phase ${ph.n}: ${ph.name}`}
        </div>
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] md:text-[34px]">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-dm-muted">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

/** a labelled progress bar with its value at the end */
export function Bar({ label, value, target, show, warn }: { label: ReactNode; value: number; target: number; show: ReactNode; warn?: boolean }) {
  const w = Math.min(100, target ? (value / target) * 100 : 0);
  return (
    <div className="grid grid-cols-[7.5em_minmax(0,1fr)_6.5em] items-center gap-3 text-[14px]">
      <span className="truncate">{label}</span>
      <div className="h-2.5 overflow-hidden rounded-full bg-dm-surface2">
        <div className={cx("h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none", warn ? "bg-dm-bad" : "bg-dm-ink")} style={{ width: w + "%" }} />
      </div>
      <span className="whitespace-nowrap text-right tabular-nums text-dm-muted">{show}</span>
    </div>
  );
}

/** 90 squares, one a day, filling as that day's checklist is ticked; gates marked */
export function Board90({ data, today, sel, onPick }: { data: Ceo; today: string; sel: string; onPick: (d: string) => void }) {
  const first = weekStart(START);
  const n = dayN(today);
  const ph = phaseOf(Math.max(1, Math.min(90, n)));
  const cells: ReactNode[] = [];
  ["M", "", "W", "", "F", "", "S"].forEach((w, i) =>
    cells.push(
      <span key={"w" + i} className="self-center text-[11px] text-dm-muted" style={{ gridRow: i + 1, gridColumn: 1 }}>
        {w}
      </span>,
    ),
  );
  for (let i = 0; i < 98; i++) {
    const d = addDays(first, i), k = dayN(d), col = Math.floor(i / 7) + 2, row = (i % 7) + 1;
    if (k < 1 || k > 90) continue;
    const sh = doneShare(data, d);
    const gate = PHASES.some((p) => p.to === k);
    cells.push(
      <button
        key={d}
        type="button"
        onClick={() => onPick(d)}
        aria-label={`Day ${k}, ${nice(d)}: ${Math.round(sh * 100)}% of the checklist done${gate ? ", gate day" : ""}`}
        title={`Day ${k} · ${nice(d)} · ${Math.round(sh * 100)}%`}
        className={cx(
          "relative aspect-square rounded-[4px] border transition",
          d < today ? "border-dm-line bg-dm-surface2" : "border-dm-line bg-dm-surface",
          d === today && "ring-2 ring-dm-bad ring-offset-1 ring-offset-dm-bg",
          d === sel && d !== today && "ring-2 ring-dm-ink ring-offset-1 ring-offset-dm-bg",
        )}
        style={{ gridRow: row, gridColumn: col, ...(sh > 0 ? { background: `rgb(var(--dm-ink) / ${0.18 + sh * 0.82})`, borderColor: "transparent" } : {}) }}
      >
        {gate && <span className="absolute inset-[28%] rotate-45 bg-dm-bad" />}
      </button>,
    );
  }
  return (
    <div>
      <div className="grid grid-cols-[18px_repeat(14,minmax(0,1fr))] gap-[3px] md:gap-1">{cells}</div>
      <div className="mt-2.5 grid grid-cols-[21fr_41fr_28fr] gap-1 pl-[21px] text-[12px] md:pl-[22px]">
        {PHASES.map((p) => (
          <div key={p.n} className={cx("border-t-[3px] pt-1", p === ph ? "border-dm-ink font-semibold" : "border-dm-line text-dm-muted")}>
            {p.n}. {p.name}
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-dm-muted">
        <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-[3px] bg-dm-ink" />Checklist done</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-[3px] bg-dm-ink/40" />Part done</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-[3px] ring-2 ring-dm-bad" />Today</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rotate-45 bg-dm-bad" />Gate day</span>
      </div>
    </div>
  );
}

export const Loading = () => (
  <div>
    <CeoNav />
    <div className="dm-panel h-64 animate-pulse motion-reduce:animate-none" aria-label="Loading" />
  </div>
);

/** a text input that saves when you leave it */
export function TextIn({ value, onSave, label, className, placeholder, type }: { value: string; onSave: (v: string) => void; label: string; className?: string; placeholder?: string; type?: string }) {
  return (
    <input
      type={type || "text"}
      aria-label={label}
      placeholder={placeholder}
      defaultValue={value}
      key={value}
      onBlur={(e) => e.target.value !== value && onSave(e.target.value)}
      className={cx("dm-field", className)}
    />
  );
}

/** a quiet delete button */
export function Del({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-dm-muted hover:bg-dm-surface2 hover:text-dm-bad">
      <Trash2 size={15} />
    </button>
  );
}

/** a number input that saves on change and shows nothing when empty */
export function NumIn({ value, onSave, label, className, step }: { value: number | null | undefined; onSave: (v: number | null) => void; label: string; className?: string; step?: string }) {
  return (
    <input
      type="number"
      min="0"
      step={step || "1"}
      inputMode="decimal"
      aria-label={label}
      defaultValue={value ?? ""}
      key={String(value ?? "")}
      onBlur={(e) => {
        const v = e.target.value === "" ? null : Number(e.target.value);
        if (v !== (value ?? null)) onSave(v);
      }}
      className={cx("dm-field", className)}
    />
  );
}
