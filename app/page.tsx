import { Info, Video } from "lucide-react";
import { brands, calendar, month, stats, user } from "@/lib/mock";
import { BrandTile, Card, cx, money } from "@/components/ui";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function shade(earned: number) {
  if (earned === 0) return "bg-[#F1F1F1] border-[#E2E2E2] text-muted";
  if (earned < 200) return "bg-[#F1FBF3] border-[#D7F0DC]";
  if (earned < 450) return "bg-[#DDF6E2] border-[#BFEAC8]";
  return "bg-[#B9EDC4] border-[#8FDCA0]";
}

export default function DashboardPage() {
  const total = calendar.reduce((s, d) => s + d.earned, 0);
  const pct = Math.min(100, Math.round((total / month.goal) * 100));
  const top = [...brands].sort((a, b) => b.earned - a.earned);
  const max = top[0].earned;
  const today = 31;
  const todayEarned = calendar[today - 1].earned;
  const totalVideos = calendar.reduce((s, d) => s + d.videos, 0);
  const best = calendar.reduce((a, d) => (d.earned > a.earned ? d : a));
  // weeks run mon to sun, so the first one is short
  const weeks: number[] = [];
  calendar.forEach((d) => {
    const w = Math.floor((d.day - 1 + month.firstWeekday) / 7);
    weeks[w] = (weeks[w] ?? 0) + d.earned;
  });
  const bestWeek = Math.max(...weeks);

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight">
            Good evening, <span className="text-brand">{user.first}</span>
          </h1>
          <p className="mt-1 text-[15px] text-muted">Here&apos;s how your {month.name} is looking.</p>
        </div>
        <div className="flex gap-3">
          <Card className="px-4 py-2.5">
            <div className="text-[13px] text-muted">Streak</div>
            <div className="text-lg font-semibold">{stats.streak} days</div>
          </Card>
          <Card className="px-4 py-2.5">
            <div className="text-[13px] text-muted">Today so far</div>
            <div className="text-lg font-semibold">{money(todayEarned)}</div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_250px]">
        <Card className="p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-lg font-semibold">
              Money calendar <Info size={14} className="text-muted" />
            </div>
            <div className="text-lg font-semibold">{money(total)}</div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 md:gap-2">
            {weekdays.map((d) => (
              <div key={d} className="pb-1 text-center text-xs text-muted">
                {d}
              </div>
            ))}
            {Array.from({ length: month.firstWeekday }).map((_, i) => (
              <div key={"pad" + i} />
            ))}
            {calendar.map((d) => (
              <div
                key={d.day}
                className={cx(
                  "flex aspect-square flex-col items-center justify-center rounded-lg border text-center",
                  shade(d.earned),
                  d.day === today && "ring-1 ring-brand",
                )}
              >
                <div className="hidden items-center gap-1 text-[11px] text-muted sm:flex">
                  <Video size={11} /> {d.videos}
                </div>
                <div className="text-base font-semibold md:text-lg">{d.day}</div>
                <div className="hidden text-[11px] text-muted sm:block">{money(d.earned)}</div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-1.5 font-semibold">
              {month.name} goal <Info size={13} className="text-muted" />
            </div>
            <div className="mt-2 text-sm">
              <b>{pct}%</b> <span className="text-muted">of {money(month.goal)}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#ECECEC]">
              <div className="h-2 rounded-full bg-brand" style={{ width: pct + "%" }} />
            </div>
          </Card>

          <Card className="grid grid-cols-2 gap-x-3 gap-y-4 p-4">
            {[
              ["Views today", stats.viewsToday],
              ["Posts today", stats.postsToday],
              ["Avg / video", money(Math.round(total / totalVideos))],
              ["This month", money(total)],
              [`Best day · Oct ${best.day}`, money(best.earned)],
              ["Best week", money(bestWeek)],
            ].map(([l, v]) => (
              <div key={String(l)}>
                <div className="text-xs text-muted">{l}</div>
                <div className="text-xl font-semibold">{v}</div>
              </div>
            ))}
          </Card>

          <Card className="p-4">
            <div className="mb-3 font-semibold">By campaign</div>
            <div className="space-y-3">
              {top.map((b) => (
                <div key={b.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <BrandTile id={b.id} size={20} />
                      {b.name}
                    </span>
                    <span>{money(b.earned)}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-[#ECECEC]">
                    <div className="h-1.5 rounded-full bg-brand" style={{ width: (b.earned / max) * 100 + "%" }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
