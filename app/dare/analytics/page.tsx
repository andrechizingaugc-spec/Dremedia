"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, money } from "@/components/ui";
import { VideoPlayer, parseClip } from "@/components/video";
import { BarList, Columns, StatTile, type Datum } from "@/components/dare/charts";
import { Chip, usePlan, usePosted } from "@/components/dare/parts";
import { PageTitle } from "@/components/dare/site";
import { DARE_UNLOCK, FAMILIES, LIBRARY, PER_DAY, PLAN_DAYS, THECAL_ALL, cardById, fmtViews, formatById, median, payFor } from "@/lib/dare";

const DAY = 86_400_000;
const n0 = (n: number) => Math.round(n).toLocaleString("en-US");
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) + "%" : "–");
function dayLabel(start: string, d: number) {
  const [y, m, dd] = start.split("-").map(Number);
  const dt = new Date(new Date(y || 2026, (m || 11) - 1, dd || 11).getTime() + d * DAY);
  return dt.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function Section({ id, title, sub, children }: { id?: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-lg font-semibold">{title}</h2>
      {sub && <p className="mb-3 mt-0.5 max-w-3xl text-[13px] text-muted">{sub}</p>}
      <div className="space-y-3">{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------- your results

function YourResults() {
  const { plan } = usePlan();
  const posted = usePosted();
  const logged = posted.filter((p) => p.views > 0);
  const views = logged.reduce((s, p) => s + p.views, 0);
  const earned = posted.reduce((s, p) => s + payFor(p.views), 0);
  const cleared = logged.filter((p) => p.views >= DARE_UNLOCK).length;

  const perDay: Datum[] = Array.from({ length: PLAN_DAYS }, (_, d) => {
    const n = posted.filter((p) => p.day === d).length;
    return { label: `Day ${d + 1} · ${dayLabel(plan.start, d)}`, value: n, sub: `${n} of ${PER_DAY} posted` };
  });
  const viewsPerDay: Datum[] = Array.from({ length: PLAN_DAYS }, (_, d) => {
    const ps = posted.filter((p) => p.day === d);
    const v = ps.reduce((s, p) => s + p.views, 0);
    return { label: `Day ${d + 1} · ${dayLabel(plan.start, d)}`, value: v, sub: `${ps.length} videos · ${money(ps.reduce((s, p) => s + payFor(p.views), 0))}` };
  });
  const byFormat: Datum[] = useMemo(() => {
    const groups = new Map<string, number[]>();
    for (const p of logged) {
      const name = cardById(p.id)?.name || p.id;
      groups.set(name, [...(groups.get(name) || []), p.views]);
    }
    return [...groups.entries()].map(([label, vs]) => ({ label, value: vs.reduce((a, b) => a + b, 0) / vs.length, sub: `${vs.length} logged · median ${fmtViews(median(vs))}` })).sort((a, b) => b.value - a.value);
  }, [logged]);
  const top = [...logged].sort((a, b) => b.views - a.views).slice(0, 4);

  return (
    <Section title="Your results" sub="From the videos you tick off on Today and the views you log on each one. Pay is estimated: nothing under 500 views, then $25 + $1.50 per 1,000 views, up to $500 a video.">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatTile label="Posted" value={`${posted.length}/${PLAN_DAYS * PER_DAY}`} sub={pct(posted.length, PLAN_DAYS * PER_DAY) + " of the plan"} />
        <StatTile label="Views logged" value={fmtViews(views)} sub={`on ${logged.length} videos`} />
        <StatTile label="Estimated pay" value={money(earned)} tone="money" sub="base + per-view" />
        <StatTile label="Cleared 500 views" value={pct(cleared, logged.length)} sub={`${cleared} of ${logged.length} logged`} />
        <StatTile label="Average views" value={logged.length ? fmtViews(views / logged.length) : "–"} sub={logged.length ? `median ${fmtViews(median(logged.map((p) => p.views)))}` : "log views to see this"} />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Columns title="Videos posted per day" sub={`Goal: ${PER_DAY} a day`} data={perDay} fmt={n0} valueLabel="Posted" every={5} empty="Tick off videos on Today and they show up here." />
        <Columns title="Views per day" sub="Logged views, by the day the video went up" data={viewsPerDay} valueLabel="Views" every={5} empty="Log the views on your posted videos (on Today) to see this." />
      </div>
      <BarList title="Average views by format" sub="Which of your 7 daily formats is working best" data={byFormat} valueLabel="Avg views" empty="Log views on a few posted videos to compare formats." />
      {top.length > 0 && (
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">Your top videos</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {top.map((p) => {
              const clip = p.url ? parseClip(p.url) : null;
              return (
                <div key={p.key}>
                  {clip ? <VideoPlayer clip={clip} /> : <div className="flex aspect-[9/16] items-center justify-center rounded-xl bg-side p-3 text-center text-[12px] text-muted">Add the post link on Today to play it here</div>}
                  <div className="mt-1 text-[13px]">
                    <b className="tabular-nums">{fmtViews(p.views)}</b> <span className="text-muted">· {money(payFor(p.views))}</span>
                  </div>
                  <div className="truncate text-[12px] text-muted">
                    Day {p.day + 1} · {cardById(p.id)?.name}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------- market

function Market() {
  // thecal.mp3's reposts have their own section below
  const vids = LIBRARY.filter((v) => v.views > 0 && v.source === "DarkUGC");
  const total = vids.reduce((s, v) => s + v.views, 0);

  const byFamily: Datum[] = FAMILIES.map((f) => {
    const vs = vids.filter((v) => v.family === f).map((v) => v.views);
    return { label: f, value: median(vs), sub: vs.length ? `${vs.length} videos · top ${fmtViews(Math.max(...vs))}` : "" };
  })
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const brands = new Map<string, number[]>();
  for (const v of vids.filter((v) => v.source === "DarkUGC")) brands.set(v.brand, [...(brands.get(v.brand) || []), v.views]);
  const byBrand: Datum[] = [...brands.entries()].map(([label, vs]) => ({ label, value: vs.reduce((a, b) => a + b, 0), sub: `${vs.length} videos · median ${fmtViews(median(vs))}` })).sort((a, b) => b.value - a.value);

  const topHooks = vids.filter((v) => v.source === "DarkUGC").sort((a, b) => b.views - a.views).slice(0, 10);
  // a type needs at least 3 videos before it can be called the best
  const best = byFamily.find((d) => Number((d.sub ?? "").split(" ")[0]) >= 3);

  return (
    <Section title="What's working" sub="The DarkUGC videos in the library: top videos from Dare's competitors and the viral hooks Dare's formats copy. Views as of Nov 10, 2026.">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Videos tracked" value={vids.length} sub="top videos from DarkUGC" />
        <StatTile label="Total views" value={fmtViews(total)} />
        <StatTile label="Median views" value={fmtViews(median(vids.map((v) => v.views)))} />
        <StatTile label="Best format type" value={best?.label || "–"} sub={best ? `median ${fmtViews(best.value)} · ${(best.sub ?? "").split(" · ")[0]}` : ""} />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <BarList title="Median views by format type" sub="Hover a bar for how many videos and the top one" data={byFamily} valueLabel="Median views" />
        <BarList title="Views by competitor brand" sub="Total views of each brand's videos in the library" data={byBrand} valueLabel="Total views" />
      </div>
      <Card className="p-4">
        <h3 className="mb-2 font-semibold">Top 10 hooks</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="py-1.5 pr-3 text-right font-medium">Views</th>
                <th className="py-1.5 pr-3 font-medium">Hook</th>
                <th className="py-1.5 pr-3 font-medium">Brand</th>
                <th className="py-1.5 font-medium">Copy it as</th>
              </tr>
            </thead>
            <tbody>
              {topHooks.map((v) => (
                <tr key={v.key} className="border-b border-line/60 align-top">
                  <td className="py-2 pr-3 text-right font-semibold tabular-nums">{fmtViews(v.views)}</td>
                  <td className="py-2 pr-3">{v.hook}</td>
                  <td className="py-2 pr-3 text-muted">{v.brand}</td>
                  <td className="py-2">{v.formatId ? <Chip className="bg-brand-wash text-brand-text">{formatById(v.formatId)?.title}</Chip> : <span className="text-muted">{v.family}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/dare/library" className="mt-3 inline-block text-[13px] text-brand-text hover:underline">
          Watch them in the library →
        </Link>
      </Card>
    </Section>
  );
}

// ---------------------------------------------------------------- thecal.mp3

function TheCal() {
  const reels = THECAL_ALL;
  const views = reels.map((r) => r[1]);
  const total = views.reduce((a, b) => a + b, 0);
  const cleared = views.filter((v) => v >= DARE_UNLOCK).length;
  const days = new Map<string, number>();
  for (const r of reels) days.set(r[2].slice(0, 10), (days.get(r[2].slice(0, 10)) || 0) + 1);
  const perDay: Datum[] = [...days.entries()].map(([d, n]) => ({ label: new Date(d + "T12:00").toLocaleDateString("en-ZA", { day: "numeric", month: "short" }), value: n, sub: `${n} reels` }));
  const perReel: Datum[] = reels.map((r) => {
    const dt = new Date(r[2]);
    return {
      label: dt.toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) + " · " + dt.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
      value: r[1],
      sub: `instagram.com/reel/${r[0]}`,
    };
  });
  const pay = views.reduce((s, v) => s + payFor(v), 0);
  const big = views.filter((v) => v >= 10_000).length;

  return (
    <Section
      id="thecal"
      title="thecal.mp3 on the same campaign"
      sub="All 48 of his reels from Oct 30 to Nov 10: almost all the same 14-second Claude + Shorts edit with a new opening clip. Views as of Nov 10; the newest reels are still growing."
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatTile label="Reels" value={reels.length} sub={`${(reels.length / days.size).toFixed(1)} a day over ${days.size} days`} />
        <StatTile label="Cleared 500 views" value={`${cleared}/${reels.length}`} sub={pct(cleared, reels.length)} />
        <StatTile label="Median views" value={fmtViews(median(views))} sub={`${big} passed 10K`} />
        <StatTile label="Total views" value={fmtViews(total)} sub={`top ${fmtViews(Math.max(...views))}`} />
        <StatTile label="At your rate" value={money(pay)} tone="money" sub="what these 48 would pay at $25 + $1.50/1K" />
      </div>
      <Columns title="Views on each reel, in posting order" sub="Most reposts land between 2K and 8K; every few days one breaks out" data={perReel} valueLabel="Views" every={8} height={190} />
      <Columns title="Reels posted per day" data={perDay} fmt={n0} valueLabel="Reels" every={2} />
    </Section>
  );
}

export default function AnalyticsPage() {
  // the site renders after your saved data loads, so jump to #thecal ourselves
  useEffect(() => {
    if (window.location.hash) setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView(), 50);
  }, []);
  return (
    <div className="space-y-10">
      <PageTitle title="Analytics" sub="Your own results from the plan, what's getting views across Dare's competitors, and how thecal.mp3's repost method performs." />
      <YourResults />
      <Market />
      <TheCal />
    </div>
  );
}
