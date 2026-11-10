"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Eye, Search, X } from "lucide-react";
import { cx } from "@/components/ui";
import { VideoPlayer } from "@/components/video";
import { Seg, Tag, VideoGrid, fmt } from "@/components/ugc/ui";
import { ALL_VIDEOS, CATEGORIES, PERIODS, SNAPSHOT_DATE, clipOf, fitsCampaign, perDay, postedWithin, type UgcVideo } from "@/lib/ugc";

const TABS = [
  { value: "trending", label: "Trending" },
  { value: "foryou", label: "For you" },
  { value: "new", label: "New" },
] as const;
type Tab = (typeof TABS)[number]["value"];

const RANGES = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "365", label: "This year" },
  { value: "0", label: "All time" },
] as const;
type Range = (typeof RANGES)[number]["value"];

const SORTS = [
  { value: "rate", label: "Views per day" },
  { value: "views", label: "Most views" },
  { value: "date", label: "Newest" },
  { value: "er", label: "Engagement" },
] as const;
type Sort = (typeof SORTS)[number]["value"];

const TAB_SORT: Record<Tab, Sort> = { trending: "rate", foryou: "views", new: "date" };
const nice = (c: string) => c.replace(/-/g, " ").replace(/^\w/, (m) => m.toUpperCase());

function Hero() {
  const week = PERIODS[0];
  const top = week.formats[0];
  const weekTop = [...ALL_VIDEOS].filter((v) => postedWithin(v, 7) && v.format === top.name).sort((a, b) => b.views - a.views);
  const lead = weekTop[0];
  return (
    <section className="mb-10 grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
      <div>
        <div className="mb-3 text-[12px] font-medium uppercase tracking-[0.1em] text-dm-muted">UGC research · updated {new Date(SNAPSHOT_DATE + "T12:00").toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</div>
        <h1 className="max-w-xl text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[52px]">See what's going viral. Film your version today.</h1>
        <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-dm-muted">
          Viral UGC videos that play right here, the numbers behind each one, a script to copy, and your 7 videos a day.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/ugc/plan" className="dm-btn-primary">
            Today's 7 videos
          </Link>
          <Link href="/ugc/viral" className="dm-btn-ghost">
            What's viral this week
          </Link>
        </div>
        <p className="mt-6 text-[13px] text-dm-muted">
          <b className="font-semibold text-dm-ink">{ALL_VIDEOS.length}</b> videos you can play · <b className="font-semibold text-dm-ink">{fmt(PERIODS[3].videos)}</b> tracked this year ·{" "}
          <b className="font-semibold text-dm-ink">{week.videos}</b> posted this week
        </p>
      </div>

      {lead && (
        <div className="mx-auto w-full max-w-[330px] md:w-[330px]">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <div>
              <div className="text-[12px] text-dm-muted">#1 format this week</div>
              <div className="text-[18px] font-semibold tracking-[-0.01em]">{top.name}</div>
            </div>
            <div className="text-right text-[12px] leading-tight text-dm-muted">
              <b className="block text-[16px] font-semibold text-dm-ink">{top.total}</b>views
            </div>
          </div>
          <div className="relative px-6 pb-2 pt-3">
            {[-8, 8].map((deg, i) => (
              <div
                key={deg}
                aria-hidden
                className="absolute inset-y-7 w-[60%] rounded-2xl border border-dm-line bg-dm-surface2 shadow-sm"
                style={{ [i === 0 ? "left" : "right"]: "3%", transform: `rotate(${deg}deg)` }}
              />
            ))}
            <div className="relative mx-auto w-[76%] rounded-2xl border border-dm-line bg-dm-surface p-1.5 shadow-xl">
              <VideoPlayer clip={clipOf(lead)} title={lead.hook} creator={lead.creator} showOpen={false} />
              <div className="flex items-center justify-between px-1 pb-0.5 pt-1.5 text-[12px]">
                <span className="truncate text-dm-muted">@{lead.creator}</span>
                <span className="flex shrink-0 items-center gap-1 font-semibold">
                  <Eye size={12} /> {fmt(lead.views)}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-[12px] text-dm-muted">
            {top.videos} videos this week · median {top.median}
            <Link href={`/ugc/video/${lead.id}`} className="mt-0.5 block font-medium text-dm-ink hover:underline">
              See why the #1 video works →
            </Link>
          </p>
        </div>
      )}
    </section>
  );
}

export default function DiscoverPage() {
  const [tab, setTab] = useState<Tab>("trending");
  const [range, setRange] = useState<Range>("30");
  const [sort, setSort] = useState<Sort>("rate");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [platform, setPlatform] = useState("");
  const [format, setFormat] = useState("");
  const feed = useRef<HTMLDivElement>(null);

  // links from Going viral open the feed on one format: /ugc/?format=Screen%20demo
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("format");
    if (f) {
      setFormat(f);
      setRange("0");
      setTimeout(() => feed.current?.scrollIntoView({ block: "start" }), 60);
    }
  }, []);

  const items = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = ALL_VIDEOS.filter(
      (v) =>
        postedWithin(v, Number(range)) &&
        (tab !== "foryou" || fitsCampaign(v)) &&
        (!cat || v.category === cat) &&
        (!platform || v.platform === platform) &&
        (!format || v.format === format) &&
        words.every((w) => `${v.hook} ${v.brand} ${v.creator} ${v.format}`.toLowerCase().includes(w)),
    );
    const key: Record<Sort, (v: UgcVideo) => number> = { views: (v) => v.views, rate: perDay, date: (v) => +new Date(v.posted), er: (v) => v.er };
    return list.sort((a, b) => key[sort](b) - key[sort](a));
  }, [tab, range, sort, q, cat, platform, format]);

  const pickFormat = (f: string) => {
    setFormat(f);
    setRange("0");
    feed.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <Hero />

      <div className="mb-8">
        <div className="mb-2 text-[12px] text-dm-muted">Top formats this week, by views</div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {PERIODS[0].formats.map((f, i) => (
            <button
              key={f.name}
              onClick={() => pickFormat(f.name)}
              className={cx("flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition", format === f.name ? "border-dm-ink bg-dm-accent text-dm-accent-fg" : "border-dm-line bg-dm-surface hover:border-dm-ink/40")}
            >
              <span className={cx("tabular-nums", format === f.name ? "opacity-70" : "text-dm-muted")}>#{i + 1}</span>
              <span className="font-medium">{f.name}</span>
              <span className={cx("tabular-nums", format === f.name ? "opacity-70" : "text-dm-muted")}>{f.total}</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={feed} className="scroll-mt-28">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <Seg
            label="Feed"
            options={TABS}
            value={tab}
            onChange={(t) => {
              setTab(t);
              setSort(TAB_SORT[t]);
            }}
          />
          <Seg label="Posted in the last" options={RANGES} value={range} onChange={setRange} />
        </div>

        <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
          <label className="relative block">
            <span className="sr-only">Search</span>
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dm-muted" />
            <input className="dm-field pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search hooks, brands, creators" />
          </label>
          <div className="grid grid-cols-3 gap-2 sm:contents">
            <select aria-label="Sort" className="dm-field" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <select aria-label="Category" className="dm-field" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">All niches</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {nice(c)}
                </option>
              ))}
            </select>
            <select aria-label="Platform" className="dm-field" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="">TikTok + IG</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-dm-muted">
          <span>
            <b className="font-semibold text-dm-ink">{items.length}</b> videos
            {tab === "foryou" && " that fit your campaign"}
            {tab === "trending" && ", fastest-growing first"}
          </span>
          {format && (
            <button onClick={() => setFormat("")} className="inline-flex items-center gap-1 rounded-full bg-dm-accent px-2.5 py-0.5 text-[12px] font-medium text-dm-accent-fg">
              {format} <X size={12} />
            </button>
          )}
          {tab === "foryou" && <Tag>AI tools + your campaign's formats</Tag>}
        </div>

        <VideoGrid key={`${tab}${range}${sort}${q}${cat}${platform}${format}`} items={items} rate={sort === "rate"} />
      </div>
    </div>
  );
}
