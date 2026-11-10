"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronRight, ExternalLink, Plus, Search, Star, Trash2 } from "lucide-react";
import { uid } from "@/lib/mock";
import { useData, useLabel } from "@/lib/store";
import { Button, Card, CopyButton, Field, Tabs, cx, money } from "@/components/ui";
import { VideoPlayer, parseClip, resolveClip, type Clip } from "@/components/video";
import {
  BOUNTY_FORMAT,
  DARE_BASE_PAY,
  DARE_FORMATS,
  EXTRAS,
  FAMILIES,
  LIBRARY,
  PER_DAY,
  PLAN_DAYS,
  dayCards,
  fmtViews,
  formatById,
  variant,
  type DareFormat,
  type Effort,
  type Family,
  type LibVideo,
  type PlanCard,
} from "@/lib/dare";

const VIEWS = ["Today", "Dare formats", "Library", "My videos"] as const;
type View = (typeof VIEWS)[number];
const HASH: Record<View, string> = { Today: "today", "Dare formats": "formats", Library: "library", "My videos": "mine" };

const effortLook: Record<Effort, string> = { easy: "bg-[#DDF6E2] text-[#2E7D46]", medium: "bg-[#FEF3C7] text-[#8A5A00]", hard: "bg-[#FEE2E2] text-[#B91C1C]" };
const stream = (id: string): Clip => ({ kind: "stream", id });

// ---------------------------------------------------------------- dates

const DAY = 86_400_000;
function parseDay(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y || 2026, (m || 11) - 1, d || 11);
}
const dateOf = (start: string, d: number) => new Date(parseDay(start).getTime() + d * DAY);
const shortDate = (dt: Date) => dt.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
const longDate = (dt: Date) => dt.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" });
function todayIndex(start: string) {
  const now = new Date();
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.min(PLAN_DAYS - 1, Math.max(0, Math.round((t - parseDay(start).getTime()) / DAY)));
}

// ---------------------------------------------------------------- small bits

function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cx("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", className || "bg-side text-[#3F3F46]")}>{children}</span>;
}

function FormatChips({ f }: { f: DareFormat }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Chip className={effortLook[f.effort]}>{f.effort}</Chip>
      {f.talking === false && <Chip className="bg-brand-wash text-brand-text">no talking</Chip>}
      {f.talking === true && <Chip>talking</Chip>}
      <Chip>{f.family}</Chip>
    </div>
  );
}

/** Dare's example videos for a format, with a switcher when there are two */
function DareExamples({ f, className }: { f: DareFormat; className?: string }) {
  const [i, setI] = useState(0);
  if (!f.streams.length)
    return <div className={cx("flex aspect-[9/16] items-center justify-center rounded-xl border border-dashed border-line p-4 text-center text-xs text-muted", className)}>Dare has no example video for this one. Read the brief.</div>;
  return (
    <div className={className}>
      <VideoPlayer clip={stream(f.streams[i])} title={`Dare example: ${f.title}`} showOpen={false} />
      {f.streams.length > 1 && (
        <div className="mt-1.5 flex gap-1">
          {f.streams.map((s, k) => (
            <button key={s} onClick={() => setI(k)} className={cx("rounded-md px-2 py-0.5 text-[11px]", k === i ? "bg-ink text-white" : "bg-side text-muted")}>
              example {k + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- today

function PlanCardView({ c, d, slot, done, onToggle }: { c: PlanCard; d: number; slot: number | null; done: boolean; onToggle: () => void }) {
  const f = formatById(c.formatId)!;
  const v = variant(c, d);
  const mand = !!c.mand && d === 0;
  return (
    <Card className={cx("overflow-hidden border-l-4 p-4", mand ? "border-l-[#EA580C]" : done ? "border-l-money" : "border-l-brand")}>
      <div className="mb-3 flex items-start gap-3">
        <button
          onClick={onToggle}
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
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted">Dare's example</div>
            <DareExamples f={f} />
          </div>
          {c.extra && (
            <div className="w-[220px] shrink-0 md:w-[190px]">
              <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted">Viral version</div>
              <VideoPlayer clip={c.extra} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted">Hook {v.letter}</div>
            <p className="text-[17px] font-semibold leading-snug">“{v.hook}”</p>
          </div>
          <div>
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted">Step by step</div>
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

function Today() {
  const { data, update } = useData();
  const plan = data.dare;
  const [day, setDay] = useState(() => todayIndex(plan.start));
  const [showExtras, setShowExtras] = useState(false);
  const key = (d: number, id: string) => `${d}-${id}`;
  const toggle = (k: string) =>
    update((x) => {
      const done = { ...x.dare.done };
      if (done[k]) delete done[k];
      else done[k] = true;
      return { ...x, dare: { ...x.dare, done } };
    });
  const countDay = (d: number) => dayCards(d).filter((c) => plan.done[key(d, c.id)]).length;

  return (
    <div className="space-y-4">
      {day === 0 && (
        <div className="rounded-xl border border-[#FDBA74] bg-[#FFF7ED] px-4 py-3 text-sm">
          <b className="text-[#C2410C]">Due by about Nov 14, 1 AM: the 3 orange cards.</b> They're Dare's mandatory assignments, so on Day 1 they replace 3 easy formats. From Day 2 it's all easy formats.
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Day {day + 1} · {longDate(dateOf(plan.start, day))}
          </h2>
          <p className="text-[13px] text-muted">
            {countDay(day)}/{PER_DAY} posted. Dare allows {PER_DAY} videos a day; the limit resets at 7 AM.
          </p>
        </div>
        <Field label="Plan starts" className="w-40">
          <input type="date" className="field" value={plan.start} onChange={(e) => e.target.value && update((x) => ({ ...x, dare: { ...x.dare, start: e.target.value } }))} />
        </Field>
      </div>

      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Pick a day">
        {Array.from({ length: PLAN_DAYS }, (_, d) => {
          const n = countDay(d);
          return (
            <button
              key={d}
              onClick={() => setDay(d)}
              aria-pressed={d === day}
              className={cx(
                "min-w-[62px] shrink-0 rounded-lg border px-2 py-1 text-center text-[13px]",
                d === day ? "border-ink bg-ink text-white" : n === PER_DAY ? "border-money bg-white" : "border-line bg-white",
              )}
            >
              Day {d + 1}
              <span className={cx("block text-[11px] tabular-nums", d === day ? "text-white/70" : "text-muted")}>
                {shortDate(dateOf(plan.start, d))} · {n}/{PER_DAY}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {dayCards(day).map((c, i) => (
          <PlanCardView key={c.id} c={c} d={day} slot={i + 1} done={!!plan.done[key(day, c.id)]} onToggle={() => toggle(key(day, c.id))} />
        ))}
      </div>

      <div>
        <button onClick={() => setShowExtras(!showExtras)} className="flex items-center gap-1.5 text-sm font-medium">
          {showExtras ? <ChevronDown size={16} /> : <ChevronRight size={16} />} Extra scripts ({EXTRAS.length}) to swap in for variety
        </button>
        {showExtras && (
          <div className="mt-3 space-y-3">
            {EXTRAS.map((c) => (
              <PlanCardView key={c.id} c={c} d={day} slot={null} done={!!plan.done[key(day, c.id)]} onToggle={() => toggle(key(day, c.id))} />
            ))}
          </div>
        )}
      </div>

      <Card className="p-4 text-[14px] leading-relaxed">
        <h3 className="mb-1 font-semibold">How thecal.mp3 repurposes one video</h3>
        <p className="text-muted">
          He's on the same Dare campaign. From Oct 30 to Nov 10 he posted 48 reels, about 5 a day, all the same 14-second "Claude + Shorts = $X/day" edit. 47 of 48 cleared 500 views (about 503K views in total, top 94.9K).
          Only the first 2 seconds change: a new lock-in pose and lighting, a new dollar figure and a new caption. Cards 1 and 2 are his method. His reels are in the Library under thecal.mp3.
        </p>
      </Card>

      <Card className="p-4 text-[14px] leading-relaxed">
        <h3 className="mb-1 font-semibold">Rules for every video</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Submit under the Dare format named on the card, not "Create Your Own".</li>
          <li>End with "Comment 'link' and I'll send it over."</li>
          <li>Captions: white text, thin black outline, no emojis, no dark boxes behind text.</li>
          <li>Cut dead space only at the start and end of each clip, and keep the audio in sync.</li>
          <li>Show real numbers only: the real view count of the clip you react to, a real listing, your own results or Dare's "Get assets".</li>
          <li>Post to TikTok or Instagram (Bounty needs one of those), then add the post link on Bounty.</li>
        </ul>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------- dare formats

function DareFormats() {
  const [only, setOnly] = useState<"All" | "Easy" | "No talking">("All");
  const order: Record<Effort, number> = { easy: 0, medium: 1, hard: 2 };
  const list = DARE_FORMATS.filter((f) => (only === "Easy" ? f.effort === "easy" : only === "No talking" ? f.talking === false : true)).sort((a, b) => order[a.effort] - order[b.effort]);
  const refs = (id: string) => LIBRARY.filter((v) => v.formatId === id && v.source !== "Dare example").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-muted">All {DARE_FORMATS.length} formats on Dare's Bounty campaign, with Dare's own example videos. Easiest first.</p>
        <Tabs items={["All", "Easy", "No talking"] as const} value={only} onChange={setOnly} />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {list.map((f) => (
          <Card key={f.id} className="grid gap-4 p-4 sm:grid-cols-[180px_1fr]">
            <DareExamples f={f} />
            <div className="min-w-0 space-y-2">
              <h3 className="font-semibold leading-snug">{f.title}</h3>
              <FormatChips f={f} />
              <p className="text-[13px] leading-relaxed">
                <span className="text-muted">Brief: </span>
                {f.brief}
              </p>
              {f.steps && (
                <details className="text-[13px]">
                  <summary className="cursor-pointer font-medium">Shot by shot</summary>
                  <ol className="mt-1 list-decimal space-y-1 pl-5 leading-relaxed">
                    {f.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </details>
              )}
              {f.script && (
                <details className="text-[13px]">
                  <summary className="cursor-pointer font-medium">Dare's script</summary>
                  <p className="mt-1 whitespace-pre-line rounded-lg bg-side px-3 py-2 leading-relaxed">{f.script}</p>
                  <CopyButton text={f.script} label="Copy script" className="mt-2" />
                </details>
              )}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[13px]">
                <a href={BOUNTY_FORMAT(f.id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-text hover:underline">
                  Open on Bounty <ExternalLink size={12} />
                </a>
                {refs(f.id) > 0 && <span className="text-muted">· {refs(f.id)} viral versions in the Library</span>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- library

const SOURCES = ["All", "Dare example", "DarkUGC", "thecal.mp3", "Starred"] as const;
type Source = (typeof SOURCES)[number];
const PAGE = 12;

function LibraryCard({ v, starred, onStar }: { v: LibVideo; starred: boolean; onStar: () => void }) {
  const f = v.formatId ? formatById(v.formatId) : undefined;
  return (
    <Card className="flex flex-col p-3">
      <VideoPlayer clip={v.clip} title={v.hook} creator={v.creator} />
      <div className="mt-2 flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 text-[12px] text-muted">
            {v.views > 0 && <b className="text-[14px] font-semibold text-ink">{fmtViews(v.views)}</b>}
            <span className="truncate">
              {v.source === "Dare example" ? "Dare example" : `@${v.creator} · ${v.brand}`}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-3 text-[13px] leading-snug">{v.hook}</p>
        </div>
        <button onClick={onStar} aria-label={starred ? "Unstar" : "Star"} className={cx("shrink-0 rounded-md p-1", starred ? "text-[#EAB308]" : "text-muted hover:text-ink")}>
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

function Library() {
  const { data, update } = useData();
  const [family, setFamily] = useState<Family | "All">("All");
  const [source, setSource] = useState<Source>("All");
  const [sort, setSort] = useState<"Most views" | "Newest">("Most views");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);
  useEffect(() => setShown(PAGE), [family, source, sort, q]);

  const starred = new Set(data.dare.starred);
  const star = (k: string) => update((x) => ({ ...x, dare: { ...x.dare, starred: starred.has(k) ? x.dare.starred.filter((s) => s !== k) : [...x.dare.starred, k] } }));

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return LIBRARY.filter((v) => family === "All" || v.family === family)
      .filter((v) => (source === "All" ? true : source === "Starred" ? starred.has(v.key) : v.source === source))
      .filter((v) => words.every((w) => `${v.hook} ${v.creator} ${v.brand} ${v.family}`.toLowerCase().includes(w)))
      .sort((a, b) => (sort === "Newest" ? (b.posted || "").localeCompare(a.posted || "") : b.views - a.views));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [family, source, sort, q, data.dare.starred]);

  const total = LIBRARY.filter((v) => v.views > 0).reduce((s, v) => s + v.views, 0);

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-muted">
        {LIBRARY.length} videos you can play right here: Dare's examples, thecal.mp3's reposts and the top videos from Dare's competitors on DarkUGC ({fmtViews(total)} views between them). Every one is tagged with the Dare format to copy it as.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-9 min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm focus-within:border-brand">
          <Search size={15} className="text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search hooks, creators, brands" className="min-w-0 flex-1 bg-transparent outline-none" />
        </label>
        <Tabs items={SOURCES} value={source} onChange={setSource} count={(s) => (s === "All" ? LIBRARY.length : s === "Starred" ? starred.size : LIBRARY.filter((v) => v.source === s).length)} />
        <Tabs items={["Most views", "Newest"] as const} value={sort} onChange={setSort} />
      </div>

      <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
        {(["All", ...FAMILIES] as const).map((fam) => (
          <button key={fam} onClick={() => setFamily(fam)} className={cx("shrink-0 rounded-lg border px-3 py-1.5 text-[13px]", family === fam ? "border-transparent bg-ink text-white" : "border-line bg-white")}>
            {fam} <span className={cx("text-[11px]", family === fam ? "text-white/70" : "text-muted")}>{fam === "All" ? LIBRARY.length : LIBRARY.filter((v) => v.family === fam).length}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.slice(0, shown).map((v) => (
          <LibraryCard key={v.key} v={v} starred={starred.has(v.key)} onStar={() => star(v.key)} />
        ))}
      </div>
      {list.length === 0 && <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">No videos match. Clear the search or pick another filter.</div>}
      {list.length > shown && (
        <div className="text-center">
          <Button onClick={() => setShown(shown + PAGE)}>Show {Math.min(PAGE, list.length - shown)} more</Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- my videos

function MyVideos() {
  const { data, update } = useData();
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [family, setFamily] = useState<string>(FAMILIES[0]);
  const [error, setError] = useState("");
  const mine = data.dare.mine;

  const [busy, setBusy] = useState(false);
  const add = async () => {
    setBusy(true);
    const clip = await resolveClip(url);
    setBusy(false);
    if (!clip)
      return setError(
        /tiktok\.com\/t\/|(vm|vt)\.tiktok/.test(url)
          ? "TikTok's short share link couldn't be read. Open it in your browser, then copy the full address (tiktok.com/@name/video/…) and paste that."
          : "That link didn't work. Paste a TikTok, Instagram reel, YouTube Short or DarkUGC video link.",
      );
    // save a link the player can always read, even if it came in as a short link
    const saved = clip.kind === "tiktok" && !parseClip(url) ? `https://www.tiktok.com/@tiktok/video/${clip.id}` : url.trim();
    update((x) => ({ ...x, dare: { ...x.dare, mine: [{ id: uid("v"), url: saved, note: note.trim(), family, addedAt: new Date().toISOString() }, ...x.dare.mine] } }));
    setUrl("");
    setNote("");
    setError("");
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="mb-1 font-semibold">Add a video</h3>
        <p className="mb-3 text-[13px] text-muted">Paste any TikTok, Instagram reel, YouTube Short or DarkUGC link. It plays right here, next to your notes.</p>
        <form
          className="grid gap-3 sm:grid-cols-[1fr_1fr_180px_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <Field label="Link">
            <input className="field" value={url} onChange={(e) => (setUrl(e.target.value), setError(""))} placeholder="https://www.tiktok.com/@…/video/…" />
          </Field>
          <Field label="Note (optional)">
            <input className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="why it works, what to copy" />
          </Field>
          <Field label="Type">
            <select className="field" value={family} onChange={(e) => setFamily(e.target.value)}>
              {FAMILIES.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </Field>
          <Button variant="primary" type="submit" disabled={!url.trim() || busy}>
            <Plus size={15} /> {busy ? "Adding…" : "Add"}
          </Button>
        </form>
        {error && <p className="mt-2 text-[13px] text-[#B91C1C]">{error}</p>}
      </Card>

      {mine.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">No videos yet. Paste a link above, for example one of your own posts or a new viral video you want to copy.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mine.map((m) => {
            const clip = parseClip(m.url);
            return (
              <Card key={m.id} className="flex flex-col p-3">
                {clip ? <VideoPlayer clip={clip} /> : <p className="text-sm text-muted">This link can't be played: {m.url}</p>}
                <div className="mt-2 flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <Chip>{m.family}</Chip>
                    {m.note && <p className="mt-1 text-[13px] leading-snug">{m.note}</p>}
                  </div>
                  <button
                    onClick={() => confirm("Remove this video?") && update((x) => ({ ...x, dare: { ...x.dare, mine: x.dare.mine.filter((y) => y.id !== m.id) } }))}
                    aria-label="Remove video"
                    className="p-1 text-muted hover:text-ink"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- page

export default function DarePage() {
  const { data } = useData();
  const title = useLabel("/dare");
  const [view, setView] = useState<View>("Today");

  // #today, #formats, #library, #mine open that view
  useEffect(() => {
    const read = () => {
      const v = VIEWS.find((x) => HASH[x] === window.location.hash.slice(1));
      if (v) setView(v);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const go = (v: View) => {
    setView(v);
    history.replaceState(null, "", `#${HASH[v]}`);
  };

  const posted = Object.keys(data.dare.done).filter((k) => {
    const [d, id] = k.split("-");
    return dayCards(Number(d)).some((c) => c.id === id);
  }).length;
  const goal = PLAN_DAYS * PER_DAY;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          7 easy Dare formats a day for 30 days, copied shot by shot from Dare's own examples and from thecal.mp3. Every video plays right here.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-3.5">
          <div className="text-[13px] text-muted">Posted</div>
          <div className="mt-1 text-[22px] font-semibold tabular-nums">
            {posted}
            <span className="text-base text-muted">/{goal}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-side">
            <div className="h-full rounded-full bg-money" style={{ width: `${(posted / goal) * 100}%` }} />
          </div>
        </Card>
        <Card className="p-3.5">
          <div className="text-[13px] text-muted">Base pay so far</div>
          <div className="mt-1 text-[22px] font-semibold tabular-nums text-money">{money(posted * DARE_BASE_PAY)}</div>
          <div className="mt-0.5 text-xs text-muted">${DARE_BASE_PAY} a video once it hits 500 views</div>
        </Card>
        <Card className="p-3.5">
          <div className="text-[13px] text-muted">If all {goal} clear 500 views</div>
          <div className="mt-1 text-[22px] font-semibold tabular-nums">{money(goal * DARE_BASE_PAY)}</div>
          <div className="mt-0.5 text-xs text-muted">plus $1.50 per 1,000 views</div>
        </Card>
        <Card className="p-3.5">
          <div className="text-[13px] text-muted">Videos in the library</div>
          <div className="mt-1 text-[22px] font-semibold tabular-nums">{LIBRARY.length + data.dare.mine.length}</div>
          <div className="mt-0.5 text-xs text-muted">{DARE_FORMATS.length} Dare formats</div>
        </Card>
      </div>

      <div className="mb-5">
        <Tabs items={VIEWS} value={view} onChange={go} count={(v) => (v === "My videos" ? data.dare.mine.length : v === "Dare formats" ? DARE_FORMATS.length : v === "Library" ? LIBRARY.length : undefined)} />
      </div>

      {view === "Today" && <Today />}
      {view === "Dare formats" && <DareFormats />}
      {view === "Library" && <Library />}
      {view === "My videos" && <MyVideos />}
    </div>
  );
}
