"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useData } from "@/lib/store";
import { Card, Field, cx, money } from "@/components/ui";
import { StatTile } from "@/components/dare/charts";
import { PlanCardView, usePlan, usePosted } from "@/components/dare/parts";
import { PageTitle } from "@/components/dare/site";
import { DARE_BASE_PAY, EXTRAS, PER_DAY, PLAN_DAYS, dayCards, payFor } from "@/lib/dare";

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

export default function TodayPage() {
  const { update } = useData();
  const { plan, key } = usePlan();
  const [day, setDay] = useState(() => todayIndex(plan.start));
  const [showExtras, setShowExtras] = useState(false);
  const posted = usePosted();
  const goal = PLAN_DAYS * PER_DAY;
  const earned = posted.reduce((s, p) => s + payFor(p.views), 0);
  const countDay = (d: number) => dayCards(d).filter((c) => plan.done[key(d, c.id)]).length;

  return (
    <div>
      <PageTitle title="Today's 7 videos" sub="Dare's easiest formats, copied shot by shot from Dare's own examples and from thecal.mp3. Watch the example, film it, tick it off, log the views." />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-3.5">
          <div className="text-[13px] text-muted">Posted</div>
          <div className="mt-1 text-[22px] font-semibold tabular-nums">
            {posted.length}
            <span className="text-base text-muted">/{goal}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-side">
            <div className="h-full rounded-full bg-money" style={{ width: `${Math.min(100, (posted.length / goal) * 100)}%` }} />
          </div>
        </Card>
        <StatTile label="Earned (from logged views)" value={money(earned)} tone="money" sub={`$${DARE_BASE_PAY} once a video hits 500 views, + $1.50 per 1K`} />
        <StatTile label={`If all ${goal} clear 500 views`} value={money(goal * DARE_BASE_PAY)} sub="base pay alone" />
        <Link href="/dare/analytics" className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
          <StatTile label="Analytics" value="See results →" sub="views, pay and what's working" className="h-full hover:border-[#D4D4D8]" />
        </Link>
      </div>

      {day === 0 && (
        <div className="mb-4 rounded-xl border border-[#FDBA74] bg-[#FFF7ED] px-4 py-3 text-sm">
          <b className="text-[#C2410C]">Due by about Nov 14, 1 AM: the 3 orange cards.</b> They're Dare's mandatory assignments, so on Day 1 they replace 3 easy formats. From Day 2 it's all easy formats.
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
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

      <div className="no-scrollbar mb-4 flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Pick a day">
        {Array.from({ length: PLAN_DAYS }, (_, d) => {
          const n = countDay(d);
          return (
            <button
              key={d}
              onClick={() => setDay(d)}
              aria-pressed={d === day}
              className={cx("min-w-[62px] shrink-0 rounded-lg border px-2 py-1 text-center text-[13px]", d === day ? "border-ink bg-ink text-white" : n === PER_DAY ? "border-money bg-white" : "border-line bg-white")}
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
          <PlanCardView key={c.id} c={c} d={day} slot={i + 1} />
        ))}
      </div>

      <div className="mt-5">
        <button onClick={() => setShowExtras(!showExtras)} className="flex items-center gap-1.5 text-sm font-medium" aria-expanded={showExtras}>
          {showExtras ? <ChevronDown size={16} /> : <ChevronRight size={16} />} Extra scripts ({EXTRAS.length}) to swap in for variety
        </button>
        {showExtras && (
          <div className="mt-3 space-y-3">
            {EXTRAS.map((c) => (
              <PlanCardView key={c.id} c={c} d={day} slot={null} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Card className="p-4 text-[14px] leading-relaxed">
          <h3 className="mb-1 font-semibold">How thecal.mp3 repurposes one video</h3>
          <p className="text-muted">
            He's on the same Dare campaign. From Oct 30 to Nov 10 he posted 48 reels, about 4 a day, all the same 14-second "Claude + Shorts = $X/day" edit. 47 of 48 cleared 500 views. Only the first 2 seconds change: a new lock-in pose and lighting, a new dollar figure and a new caption. Cards 1 and 2 are his method.{" "}
            <Link href="/dare/analytics#thecal" className="text-brand-text hover:underline">
              See his numbers
            </Link>
            .
          </p>
        </Card>
        <Card className="p-4 text-[14px] leading-relaxed">
          <h3 className="mb-1 font-semibold">Rules for every video</h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Submit under the Dare format named on the card, not "Create Your Own".</li>
            <li>End with "Comment 'link' and I'll send it over."</li>
            <li>Captions: white, thin black outline, no emojis, no dark boxes.</li>
            <li>Show real numbers only (real views, real listings, your own results or Dare's "Get assets").</li>
            <li>Post to TikTok or Instagram, then add the post link on Bounty and here.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
