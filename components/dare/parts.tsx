"use client";

import { useState, type ReactNode } from "react";
import { Check, ExternalLink, Star } from "lucide-react";
import { useData } from "@/lib/store";
import { Card, CopyButton, cx, money } from "@/components/ui";
import { VideoPlayer, parseClip, type Clip } from "@/components/video";
import { BOUNTY_FORMAT, EXTRAS, PER_DAY, PLAN_DAYS, dayCards, fmtViews, formatById, payFor, variant, type DareFormat, type Effort, type LibVideo, type PlanCard } from "@/lib/dare";

export const effortLook: Record<Effort, string> = { easy: "bg-[#DDF6E2] text-[#2E7D46]", medium: "bg-[#FEF3C7] text-[#8A5A00]", hard: "bg-[#FEE2E2] text-[#B91C1C]" };
export const stream = (id: string): Clip => ({ kind: "stream", id });

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", className || "bg-side text-[#3F3F46]")}>{children}</span>;
}

export function FormatChips({ f }: { f: DareFormat }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Chip className={effortLook[f.effort]}>{f.effort}</Chip>
      {f.talking === false && <Chip className="bg-brand-wash text-brand-text">no talking</Chip>}
      {f.talking === true && <Chip>talking</Chip>}
      <Chip>{f.family}</Chip>
    </div>
  );
}

export const Label = ({ children }: { children: ReactNode }) => <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted">{children}</div>;

/** Dare's example videos for a format, with a switcher when there are two */
export function DareExamples({ f, className }: { f: DareFormat; className?: string }) {
  const [i, setI] = useState(0);
  if (!f.streams.length)
    return <div className={cx("flex aspect-[9/16] items-center justify-center rounded-xl border border-dashed border-line p-4 text-center text-xs text-muted", className)}>Dare has no example video for this one. Read the brief.</div>;
  return (
    <div className={className}>
      <VideoPlayer clip={stream(f.streams[i])} title={`Dare example: ${f.title}`} showOpen={false} />
      {f.streams.length > 1 && (
        <div className="mt-1.5 flex gap-1">
          {f.streams.map((s, k) => (
            <button key={s} onClick={() => setI(k)} aria-pressed={k === i} className={cx("rounded-md px-2 py-0.5 text-[11px]", k === i ? "bg-ink text-white" : "bg-side text-muted")}>
              example {k + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** reads and writes the Dare plan in the dashboard store */
export function usePlan() {
  const { data, update } = useData();
  const plan = data.dare;
  const key = (d: number, id: string) => `${d}-${id}`;
  return {
    plan,
    key,
    toggle: (k: string) =>
      update((x) => {
        const done = { ...x.dare.done };
        if (done[k]) delete done[k];
        else done[k] = true;
        return { ...x, dare: { ...x.dare, done } };
      }),
    setResult: (k: string, patch: Partial<{ views: number; url: string }>) =>
      update((x) => {
        const prev = x.dare.results?.[k] ?? { views: 0, url: "" };
        return { ...x, dare: { ...x.dare, results: { ...(x.dare.results || {}), [k]: { ...prev, ...patch } } } };
      }),
  };
}

export function PlanCardView({ c, d, slot }: { c: PlanCard; d: number; slot: number | null }) {
  const { plan, key, toggle, setResult } = usePlan();
  const k = key(d, c.id);
  const done = !!plan.done[k];
  const result = plan.results?.[k] ?? { views: 0, url: "" };
  const f = formatById(c.formatId)!;
  const v = variant(c, d);
  const mand = !!c.mand && d === 0;
  const myClip = result.url ? parseClip(result.url) : null;

  return (
    <Card className={cx("overflow-hidden border-l-4 p-4", mand ? "border-l-[#EA580C]" : done ? "border-l-money" : "border-l-brand")}>
      <div className="mb-3 flex items-start gap-3">
        <button
          onClick={() => toggle(k)}
          aria-label={done ? `Mark not posted: ${c.name}` : `Mark posted: ${c.name}`}
          className={cx("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition", done ? "border-money bg-money text-white" : "border-line bg-white hover:border-brand")}
        >
          {done && <Check size={16} strokeWidth={3} />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            {slot ? <span className="tabular-nums">Video {d * PER_DAY + slot} of {PLAN_DAYS * PER_DAY}</span> : <span>Extra</span>}
            {mand ? <Chip className="bg-[#FFEDD5] text-[#C2410C]">Mandatory · due ~Nov 14</Chip> : <Chip className="bg-brand-wash text-brand-text">{c.tag}</Chip>}
            {done && <Chip className="bg-[#DDF6E2] text-[#2E7D46]">Posted</Chip>}
          </div>
          <h3 className="font-semibold leading-snug">{c.name}</h3>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="no-scrollbar -mx-1 flex shrink-0 gap-3 overflow-x-auto px-1 md:mx-0 md:overflow-visible md:px-0">
          <div className="w-[220px] shrink-0 md:w-[190px]">
            <Label>Dare's example</Label>
            <DareExamples f={f} />
          </div>
          {c.extra && (
            <div className="w-[220px] shrink-0 md:w-[190px]">
              <Label>Viral version</Label>
              <VideoPlayer clip={c.extra} />
            </div>
          )}
          {myClip && (
            <div className="w-[220px] shrink-0 md:w-[190px]">
              <Label>Your post</Label>
              <VideoPlayer clip={myClip} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <Label>Hook {v.letter}</Label>
            <p className="text-[17px] font-semibold leading-snug">“{v.hook}”</p>
          </div>
          <div>
            <Label>Step by step</Label>
            <ol className="list-decimal space-y-1 pl-5 text-[14px] leading-relaxed">
              {v.body.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ol>
          </div>
          <div className="grid gap-1 text-[13px] text-muted sm:grid-cols-2">
            <p>
              Submit under: <b className="font-medium text-ink">{f.title}</b>
            </p>
            <p>
              Today's swap: <b className="font-medium text-ink">{v.swap}</b>
            </p>
          </div>
          <p className="rounded-lg bg-side px-3 py-2 text-[13px] leading-relaxed">
            <span className="text-muted">Setup: </span>
            {c.setup}
          </p>

          {done && (
            <div className="grid gap-2 rounded-lg border border-line p-3 sm:grid-cols-[130px_1fr_auto] sm:items-end">
              <label className="block">
                <span className="field-label">Views so far</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  className="field"
                  value={result.views || ""}
                  onChange={(e) => setResult(k, { views: Math.max(0, Number(e.target.value) || 0) })}
                  placeholder="0"
                />
              </label>
              <label className="block">
                <span className="field-label">Post link (plays here once added)</span>
                <input className="field" value={result.url} onChange={(e) => setResult(k, { url: e.target.value })} placeholder="https://www.tiktok.com/@you/video/…" />
              </label>
              <div className="text-[13px] sm:pb-2">
                <span className="text-muted">Pays </span>
                <b className="tabular-nums">{money(payFor(result.views))}</b>
                {result.views > 0 && result.views < 500 && <span className="block text-[11px] text-muted">{500 - result.views} views to unlock</span>}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <CopyButton text={`${v.hook}\n\n${v.body.join("\n")}`} label="Copy script" />
            <a href={BOUNTY_FORMAT(f.id)} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-[13px] font-medium hover:bg-side">
              Submit on Bounty <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function LibraryCard({ v, starred, onStar }: { v: LibVideo; starred: boolean; onStar: () => void }) {
  const f = v.formatId ? formatById(v.formatId) : undefined;
  return (
    <Card className="flex flex-col p-3">
      <VideoPlayer clip={v.clip} title={v.hook} creator={v.creator} />
      <div className="mt-2 flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 text-[12px] text-muted">
            {v.views > 0 && <b className="text-[14px] font-semibold text-ink">{fmtViews(v.views)}</b>}
            <span className="truncate">{v.source === "Dare example" ? "Dare example" : `@${v.creator} · ${v.brand}`}</span>
          </div>
          <p className="mt-0.5 line-clamp-3 text-[13px] leading-snug">{v.hook}</p>
        </div>
        <button onClick={onStar} aria-label={starred ? "Unstar" : "Star"} aria-pressed={starred} className={cx("shrink-0 rounded-md p-1", starred ? "text-[#EAB308]" : "text-muted hover:text-ink")}>
          <Star size={16} fill={starred ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <Chip>{v.family}</Chip>
        {f && v.source !== "Dare example" && <Chip className="bg-brand-wash text-brand-text">copy as: {f.title}</Chip>}
      </div>
    </Card>
  );
}

/** every posted video in the plan, with its logged views and link */
export function usePosted() {
  const { plan } = usePlan();
  return Object.keys(plan.done)
    .map((k) => {
      const i = k.indexOf("-");
      const day = Number(k.slice(0, i));
      const id = k.slice(i + 1);
      return { key: k, day, id, views: plan.results?.[k]?.views || 0, url: plan.results?.[k]?.url || "" };
    })
    .filter((p) => p.day >= 0 && p.day < PLAN_DAYS && (dayCards(p.day).some((c) => c.id === p.id) || EXTRAS.some((c) => c.id === p.id)));
}
