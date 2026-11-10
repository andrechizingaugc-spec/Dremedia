"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cx } from "@/components/ui";
import { PageHead } from "@/components/ugc/site";
import { Panel, Seg, SectionTitle, Stat, VideoGrid, fmt } from "@/components/ugc/ui";
import { ALL_VIDEOS, PERIODS, n, perDay, postedWithin, type Group, type Period } from "@/lib/ugc";

const OPTIONS = PERIODS.map((p) => ({ value: p.key, label: p.label }));
const pctChange = (now: number, before: number) => (before ? Math.round(((now - before) / before) * 100) : null);

function Change({ value, suffix = "" }: { value: number | null; suffix?: string }) {
  if (value === null || !isFinite(value)) return <span className="text-dm-muted">new</span>;
  const up = value >= 0;
  return (
    <span className={cx("inline-flex items-center gap-0.5 tabular-nums", up ? "text-dm-good" : "text-dm-muted")}>
      {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
      {up ? "+" : ""}
      {value}%{suffix}
    </span>
  );
}

/** a ranked table with a bar for total views: what's winning in this period */
function RankTable({ title, sub, rows, link }: { title: string; sub: string; rows: Group[]; link?: (name: string) => string }) {
  const max = Math.max(...rows.map((r) => n(r.total)), 1);
  return (
    <Panel className="p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mb-3 mt-0.5 text-[13px] text-dm-muted">{sub}</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-[13px]">
          <thead>
            <tr className="border-b border-dm-line text-left text-[12px] text-dm-muted">
              <th className="w-7 py-1.5 font-medium">#</th>
              <th className="py-1.5 pr-3 font-medium">Name</th>
              <th className="w-[34%] py-1.5 pr-3 font-medium">Total views</th>
              <th className="py-1.5 pr-3 text-right font-medium">Median</th>
              <th className="py-1.5 pr-3 text-right font-medium">Videos</th>
              <th className="py-1.5 text-right font-medium">vs before</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name} className="border-b border-dm-line/60 last:border-0">
                <td className="py-2 tabular-nums text-dm-muted">{i + 1}</td>
                <td className="py-2 pr-3 font-medium">
                  {link ? (
                    <Link href={link(r.name)} className="hover:underline">
                      {r.name}
                    </Link>
                  ) : (
                    r.name
                  )}
                </td>
                <td className="py-2 pr-3">
                  <span className="flex items-center gap-2">
                    <span className="h-3 rounded-r-[4px] bg-dm-ink" style={{ width: `${(n(r.total) / max) * 100}%`, minWidth: 2, maxWidth: "calc(100% - 3rem)" }} />
                    <span className="shrink-0 tabular-nums text-dm-muted">{r.total}</span>
                  </span>
                </td>
                <td className="py-2 pr-3 text-right tabular-nums">{r.median}</td>
                <td className="py-2 pr-3 text-right tabular-nums">{r.videos.toLocaleString()}</td>
                <td className="py-2 text-right">{r.change ? <span className={cx("tabular-nums", r.change.startsWith("+") ? "text-dm-good" : "text-dm-muted")}>{r.change} median</span> : <Change value={pctChange(r.videos, r.prev ?? 0)} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Insights({ p }: { p: Period }) {
  // momentum: more videos than the period before, or a better median
  const rising = p.formats.filter((f) => (f.change ? f.change.startsWith("+") : (f.prev ?? 0) < f.videos)).slice(0, 3);
  const bestMedian = [...p.formats].sort((a, b) => n(b.median) - n(a.median))[0];
  const hook = p.hooks[0];
  return (
    <Panel className="p-4">
      <h3 className="mb-2 font-semibold">What this means for your next video</h3>
      <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed">
        {bestMedian && (
          <li>
            <b>{bestMedian.name}</b> has the best typical result right now: median {bestMedian.median} views per video. Most formats land lower, so it's the safest bet.
          </li>
        )}
        {rising.length > 0 && (
          <li>
            Rising: <b>{rising.map((f) => f.name).join(", ")}</b>. More creators are posting them{p.key === "month" || p.key === "year" ? " and views are holding up" : ""}, so the algorithm is pushing them.
          </li>
        )}
        {hook && (
          <li>
            Open with a <b>{hook.name.toLowerCase()}</b> hook: it led {hook.videos} videos to {hook.total} views. On the Scripts page every template says which hook it uses.
          </li>
        )}
        {p.videos < p.prevVideos ? (
          <li>
            Fewer videos went up than the period before ({p.videos.toLocaleString()} vs {p.prevVideos.toLocaleString()}), so there's less competition for the same views.
          </li>
        ) : (
          <li>
            More videos went up than the period before ({p.videos.toLocaleString()} vs {p.prevVideos.toLocaleString()}), so the first second matters more than ever.
          </li>
        )}
      </ul>
    </Panel>
  );
}

export default function ViralPage() {
  const [key, setKey] = useState<Period["key"]>("week");
  const p = PERIODS.find((x) => x.key === key)!;
  const top = ALL_VIDEOS.filter((v) => postedWithin(v, p.days)).sort((a, b) => b.views - a.views);
  const fastest = ALL_VIDEOS.filter((v) => postedWithin(v, p.days)).sort((a, b) => perDay(b) - perDay(a));
  const fmtLink = (name: string) => `/ugc/?format=${encodeURIComponent(name)}`;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="Trends"
        title="Going viral"
        sub="What's getting views in UGC right now: the top videos, formats, hooks, brands and creators for this week, this month, the last 90 days and this year."
      >
        <Seg label="Period" options={OPTIONS} value={key} onChange={setKey} />
      </PageHead>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Videos posted" value={p.videos.toLocaleString()} sub={<Change value={pctChange(p.videos, p.prevVideos)} suffix=" vs the period before" />} />
        <Stat label="Top format" value={<span className="text-[18px]">{p.formats[0].name}</span>} sub={`${p.formats[0].total} views · median ${p.formats[0].median}`} />
        {p.hooks[0] ? (
          <Stat label="Top hook type" value={<span className="text-[18px]">{p.hooks[0].name}</span>} sub={`${p.hooks[0].total} views on ${p.hooks[0].videos} videos`} />
        ) : (
          <Stat label="Best median" value={<span className="text-[18px]">{[...p.formats].sort((a, b) => n(b.median) - n(a.median))[0].name}</span>} sub={`median ${[...p.formats].sort((a, b) => n(b.median) - n(a.median))[0].median}`} />
        )}
        {p.brands[0] ? (
          <Stat label="Top brand" value={<span className="text-[18px]">{p.brands[0].name}</span>} sub={`${p.brands[0].total} views on ${p.brands[0].videos} videos`} />
        ) : (
          <Stat label="Biggest video" value={top[0] ? fmt(top[0].views) : "–"} sub={top[0] ? `${top[0].brand} · @${top[0].creator}` : ""} />
        )}
      </div>

      <section>
        <SectionTitle sub={`Posted since ${new Date(p.since + "T12:00").toLocaleDateString("en-ZA", { day: "numeric", month: "long" })}, most views first. They play right here.`}>Top videos · {p.label.toLowerCase()}</SectionTitle>
        <VideoGrid key={key} items={top} step={8} ranked />
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <RankTable title="Formats" sub="Click one to see its videos" rows={p.formats} link={fmtLink} />
        <Insights p={p} />
      </div>

      {(p.hooks.length > 0 || p.brands.length > 0) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {p.hooks.length > 0 && <RankTable title="Hook types" sub="How the first second grabs people" rows={p.hooks} />}
          {p.brands.length > 0 && <RankTable title="Brands" sub="Apps paying creators for these videos" rows={p.brands} />}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {p.creators.length > 0 && (
          <Panel className="p-4">
            <h3 className="font-semibold">Top creators</h3>
            <p className="mb-3 mt-0.5 text-[13px] text-dm-muted">Small accounts making UGC that pops. Study their feeds.</p>
            <ol className="space-y-2">
              {p.creators.map((c, i) => (
                <li key={c.handle} className="flex items-center gap-3 text-[14px]">
                  <span className="w-5 tabular-nums text-dm-muted">{i + 1}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dm-surface2 text-[12px] font-semibold uppercase">{c.handle[0]}</span>
                  <span className="min-w-0 flex-1 truncate font-medium">@{c.handle}</span>
                  <span className="text-[13px] tabular-nums text-dm-muted">
                    {c.videos} videos · <b className="font-semibold text-dm-ink">{c.total}</b>
                  </span>
                </li>
              ))}
            </ol>
          </Panel>
        )}
        <Panel className="p-4">
          <h3 className="font-semibold">Fastest growing</h3>
          <p className="mb-3 mt-0.5 text-[13px] text-dm-muted">Views per day since posting. A young video near the top is still climbing.</p>
          <ol className="space-y-2">
            {fastest.slice(0, 6).map((v, i) => (
              <li key={v.id} className="flex items-center gap-3 text-[14px]">
                <span className="w-5 tabular-nums text-dm-muted">{i + 1}</span>
                <Link href={`/ugc/video/${v.id}`} className="min-w-0 flex-1 truncate hover:underline">
                  {v.hook}
                </Link>
                <span className="shrink-0 text-[13px] tabular-nums text-dm-muted">
                  <b className="font-semibold text-dm-ink">{fmt(perDay(v))}</b>/day
                </span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </div>
  );
}
